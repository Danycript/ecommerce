export const variationDetails = `WITH AllOtherVariations AS (
    SELECT 
        variation.product_id,
        variation.id AS variation_id,
        variation.color_id,
        galleries.image_path AS variation_image,
        color.name AS variation_color,
        variation.is_main_item,
        ROW_NUMBER() OVER (PARTITION BY variation.id ORDER BY galleries.display_order) AS image_rank
    FROM 
        variation
    LEFT JOIN 
        galleries ON variation.id = galleries.variation_id
    JOIN 
        color ON variation.color_id = color.id
    WHERE 
        variation.id <> 3 
)
SELECT 
    product.id AS product_id,
    product.product_name,
    product.product_info,
    product.about_me,
    product.care_instructions,
    
  
    current_variation.id AS variation_id,
    current_variation.color_id,
    current_variation.discription,
    current_variation.price,
    brand.brand_name AS brand,
    color.name AS current_color,


    (SELECT JSON_AGG(JSON_BUILD_OBJECT('image', current_galleries.image_path, 'display_order', current_galleries.display_order) ORDER BY current_galleries.display_order)
     FROM galleries AS current_galleries
     WHERE current_galleries.variation_id = current_variation.id) AS current_images,


    (SELECT JSON_AGG(JSON_BUILD_OBJECT('size', size_option.size_name, 'quantity_in_stock', variation_option.qty_in_stock))
     FROM variation_option
     LEFT JOIN size_option ON variation_option.size_option_id = size_option.id
     WHERE variation_option.variation_id = current_variation.id) AS sizes_quantity,

   
    JSON_AGG(JSON_BUILD_OBJECT('variation_image', AllOtherVariations.variation_image, 'variation_color', AllOtherVariations.variation_color, 'is_main_item', AllOtherVariations.is_main_item)
     ORDER BY AllOtherVariations.image_rank) FILTER (WHERE AllOtherVariations.image_rank = 1) AS other_variation_images

FROM 
    product
JOIN 
    variation AS current_variation ON product.id = current_variation.product_id
JOIN  
    brand ON product.brand_id = brand.id
JOIN 
    category ON product.category_id = category.id
JOIN
    color ON current_variation.color_id = color.id


LEFT JOIN 
    AllOtherVariations ON product.id = AllOtherVariations.product_id
WHERE 
    current_variation.id = 3
GROUP BY 
    product.id, 
    product.product_name, 
    product.product_info, 
    product.about_me, 
    product.care_instructions, 
    current_variation.id, 
    current_variation.color_id, 
    current_variation.discription, 
    current_variation.price, 
    brand.brand_name, 
    color.name;

`;

export const createUser = `
  INSERT INTO "user" (first_name,last_name,email, passwordhash) 
  VALUES ($1, $2, $3, $4)
`;

export const queryUser = `SELECT * FROM "user" WHERE email =$1`;
