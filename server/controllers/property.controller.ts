
import { Request, Response } from 'express';
import { query } from '../db';

/**
 * Property Controller
 * Handles Property CRUD operations.
 * Adapted for Simplified Schema (MVP).
 */
export class PropertyController {

    // GET /api/properties
    async listProperties(req: Request, res: Response) {
        try {
            const { ownerId } = req.query;
            const params: any[] = [];
            let whereClause = '';

            if (ownerId) {
                whereClause = 'WHERE owner_id = $1';
                params.push(ownerId);
            }

            // Mapping Simplified Schema to Frontend DTO
            const sql = `
                SELECT 
                    id::text, 
                    title,
                    price as "salePrice",
                    address as "addressLine1",
                    beds as "bedrooms",
                    baths as "bathrooms",
                    sqft as "squareFeet",
                    image_url as "primaryImageUrl",
                    type as "listingType",
                    'house' as "propertyType",
                    'active' as "status"
                FROM properties
                ${whereClause}
                ORDER BY created_at DESC
            `;

            const result = await query(sql, params);

            res.json({
                success: true,
                data: {
                    data: result.rows,
                    total: result.rowCount,
                    page: 1,
                    limit: 100
                }
            });
        } catch (err: any) {
            console.error('Error listing properties:', err);
            res.status(500).json({ success: false, error: { message: 'Failed to fetch properties', details: err.message } });
        }
    }

    // GET /api/properties/:id
    async getPropertyById(req: Request, res: Response) {
        const { id } = req.params;
        try {
            const sql = `
                SELECT 
                    id::text,
                    title,
                    price as "salePrice",
                    address as "addressLine1",
                    beds as "bedrooms",
                    baths as "bathrooms",
                    sqft as "squareFeet",
                    image_url as "primaryImageUrl",
                    type as "listingType",
                    'house' as "propertyType",
                    'active' as "status",
                    -- Construct mock images array from single image_url
                    json_build_array(
                        json_build_object('url', image_url, 'isPrimary', true)
                    ) as images
                FROM properties
                WHERE id = $1
            `;

            const result = await query(sql, [id]);

            if (result.rows.length === 0) {
                return res.status(404).json({ success: false, error: { message: 'Property not found' } });
            }

            res.json({
                success: true,
                data: result.rows[0]
            });
        } catch (err: any) {
            console.error('Error fetching property:', err);
            res.status(500).json({ success: false, error: { message: 'Failed to fetch property details', details: err.message } });
        }
    }

    // POST /api/properties
    async createProperty(req: Request, res: Response) {
        try {
            const {
                title,
                listingType,
                salePrice,
                rentPrice,
                addressLine1,
                bedrooms,
                bathrooms,
                squareFeet,
                images
            } = req.body;

            // Simplified mapping for MVP
            const price = listingType === 'rent' ? rentPrice : salePrice;
            const primaryImage = (images && images.length > 0) ? images[0].url : null;
            const ownerId = req.user?.id; // From rbacGuard

            if (!ownerId) {
                return res.status(401).json({ success: false, error: { message: 'Unauthorized' } });
            }

            const sql = `
                INSERT INTO properties (
                    title, type, price, address, beds, baths, sqft, image_url, owner_id
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                RETURNING id, title
            `;

            const result = await query(sql, [
                title,
                listingType,
                Number(price) || 0,
                addressLine1,
                Number(bedrooms) || 0,
                Number(bathrooms) || 0,
                Number(squareFeet) || 0,
                primaryImage,
                ownerId
            ]);

            res.status(201).json({
                success: true,
                data: result.rows[0]
            });

        } catch (err: any) {
            console.error('Error creating property:', err);
            res.status(500).json({ success: false, error: { message: 'Failed to create property', details: err.message } });
        }
    }

    // PATCH /api/properties/:id
    async updateProperty(req: Request, res: Response) {
        const { id } = req.params;
        const body = req.body;
        const ownerId = req.user?.id;

        try {
            if (!ownerId) return res.status(401).json({ success: false, message: 'Unauthorized' });

            // Construct dynamic update
            const fields: string[] = [];
            const values: any[] = [];
            let idx = 1;

            if (body.title) { fields.push(`title = $${idx++}`); values.push(body.title); }
            if (body.listingType) { fields.push(`type = $${idx++}`); values.push(body.listingType); }
            if (body.salePrice || body.rentPrice) {
                const price = body.listingType === 'rent' ? body.rentPrice : body.salePrice;
                fields.push(`price = $${idx++}`); values.push(Number(price));
            }
            if (body.addressLine1) { fields.push(`address = $${idx++}`); values.push(body.addressLine1); }
            if (body.bedrooms) { fields.push(`beds = $${idx++}`); values.push(Number(body.bedrooms)); }
            if (body.bathrooms) { fields.push(`baths = $${idx++}`); values.push(Number(body.bathrooms)); }
            if (body.squareFeet) { fields.push(`sqft = $${idx++}`); values.push(Number(body.squareFeet)); }
            if (body.images && body.images.length > 0) { fields.push(`image_url = $${idx++}`); values.push(body.images[0].url); }

            if (fields.length === 0) {
                return res.status(400).json({ success: false, message: 'No fields to update' });
            }

            values.push(id);
            values.push(ownerId);

            const sql = `
                UPDATE properties 
                SET ${fields.join(', ')}
                WHERE id = $${idx++} AND owner_id = $${idx++}
                RETURNING *
            `;

            const result = await query(sql, values);

            if (result.rowCount === 0) {
                return res.status(404).json({ success: false, error: { message: 'Property not found or you do not have permission to edit it.' } });
            }

            res.json({ success: true, data: result.rows[0] });

        } catch (err: any) {
            console.error('Error updating property:', err);
            res.status(500).json({ success: false, error: { message: 'Update failed', details: err.message } });
        }
    }

    // DELETE /api/properties/:id
    async deleteProperty(req: Request, res: Response) {
        const { id } = req.params;
        const ownerId = req.user?.id;

        try {
            if (!ownerId) return res.status(401).json({ success: false, message: 'Unauthorized' });

            const sql = `DELETE FROM properties WHERE id = $1 AND owner_id = $2 RETURNING id`;
            const result = await query(sql, [id, ownerId]);

            if (result.rowCount === 0) {
                return res.status(404).json({ success: false, error: { message: 'Property not found or you do not have permission to delete it.' } });
            }

            res.json({ success: true, message: 'Property deleted' });

        } catch (err: any) {
            console.error('Error deleting property:', err);
            res.status(500).json({ success: false, error: { message: 'Delete failed', details: err.message } });
        }
    }
}
