const pool = require("../config/db");

const {
    successResponse,
    errorResponse,
} = require("../utils/response");

exports.getAllProducts = async(req, res, next)=> {
    try{
        const result = await pool.query(
            "SELECT * FROM products ORDER BY id ASC"
        );
        return successResponse(
            res,
            200,
             "Products retrieved successfully",
            result.rows
        );
    }catch (error){
        next(error);
    }
    
};

exports.getProductById = async (req, res, next) =>{
    try{
        const { id } = req.params;

        const result = await pool.query(
            "SELECT * FROM products WHERE id = $1",[id]
        );
        if (result.rows.length === 0){
            return errorResponse(
            res,
            404,
              "Product not found",

        );
        }
         return successResponse(
            res,
            200,
             "Products retrieved successfully",
            result.rows[0]
        );
    }catch (error){
        next(error);
    }
};

exports.createProduct = async (req, res, next) => {
try{
    const{name, description, price} = req.body;
    
    if (!name.trim() || !price == null){
        return errorResponse(
            res,
            400,
            "Name and Price are required",

        );
    }
    const result = await pool.query(
        `INSERT INTO products (name, description, price)
        VALUES ($1, $2,$3)
        RETURNING *`,
        [name,description,price]
    );
     return successResponse(
            res,
            201,
            "Product created successfully",
            result.rows[0]
        );
} catch(error){
    next(error);
}
};

exports.updateProduct = async(req,res,next) =>{
    try{
        const {id} = req.params;
        const {name, description, price} = req.body;

        const result = await pool.query(
            `UPDATE products
            SET name = $1,
            description = $2,
            price = $3
            WHERE id =$4
            RETURNING *`,[name,description,price,id]
        );
        if (result.rows.length === 0){
                return errorResponse(
            res,
            404,
            "Product not found",

        );
        }
         return successResponse(
            res,
            200,
            "Product Updated successfully",
            result.rows[0]
        );
    }catch(error){
        next(error);
    }
};

exports.deleteProduct = async (req,res,next) =>{
    try{
        const {id} = req.params;

        const result = await pool.query(
            "DELETE FROM products WHERE id = $1 RETURNING *",
            [id]
        );

        if (result.rows.length === 0){
             return errorResponse(
            res,
            404,
            "Product not found",

        );
        }
         return successResponse(
            res,
            200,
            "Product delete successfully",
            result.rows[0]
        );
    }catch (error){
        next(error);
    }
};