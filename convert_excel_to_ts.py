#!/usr/bin/env python3
import openpyxl
import json
import re

def slugify(name):
    """Convert product name to URL-friendly slug"""
    return re.sub(r'[^\w\s-]', '', name).strip().replace(' ', '-').lower()

def get_image_path(product_id, filename):
    """Generate full image path from product ID and filename"""
    if not filename:
        return None
    
    # Map product IDs to their folder names
    folder_mapping = {
        'P001': 'earrings/Round Diamond Stud Earrings 1ct (P001)',
        'P002': 'earrings/Diamond Transformer Stud Earrings (P002)',
        'P003': 'earrings/Diamond Stud Earrings 2ct (P003)',
        'P004': 'Rings/Half Eternity Diamond Ring  (P004)',
        'P005': 'Rings/Solitaire Diamond Ring (P005)',
        'P006': 'Rings/Vivid Pink Diamond Ring 3ct (P006)',
        'P007': 'Rings/Oval Solitaire Diamond Ring 2ct(P007)',
        'P008': 'Rings/Halo Diamond Engagement Ring (P008)',
        'P009': 'Rings/Full Eternity Diamond Band 5ct (P009)',
        'P010': 'Rings/Emerald Cut Eternity Diamond Band 10ct (P010)',
        'P011': 'Rings/Three Stones Pear Diamond Ring 4ct (P011)',
        'P012': 'Pendants/Pear Diamond Pendant 3ct (P012)',
        'P013': 'Pendants/Diamond Cross Pendant 3ct (P013)',
        'P014': 'Pendants/Diamond Cross Pendant 4ct (P014)',
        'P015': 'Pendants/Halo Diamond Pendant 2ct (P015)',
        'P016': 'Bracelets/Diamond Tennis Bracelet 9ct (P016)',
        'P017': 'Bracelets/Diamond Tennis Bracelet 12ct (P017)',
        'P018': 'earrings/Diamond Stud Earrings 3.5ct Rose Gold (P0018)',
    }
    
    folder = folder_mapping.get(product_id, '')
    if folder:
        return f'/Products/{folder}/{filename}'
    return None

def convert_price_to_rubles(usd_price):
    """Convert USD to Russian Rubles (approximate rate)"""
    if not usd_price:
        return '0 ₽'
    try:
        rubles = int(float(usd_price) * 95)
        return f'{rubles:,} ₽'.replace(',', ' ')
    except:
        return '0 ₽'

def main():
    wb = openpyxl.load_workbook('public/Products/Jewelry_Inventory_Final11.xlsx')
    sheet = wb.active
    
    products = []
    
    for row in sheet.iter_rows(min_row=2, values_only=True):
        (product_id, name_std, name_display, category, product_type, metal_type,
         gold_weight, gemstone_type, total_carat, main_stone_carat, diamond_color,
         diamond_clarity, diamond_cut, certificate_type, certificate_number,
         price_usd, price_range, description, dimensions, care_instructions,
         image_url, quick_filter, alt_text, seo_tags, img_front, img_side,
         img_top, img_model) = row
        
        # Map category names
        category_mapping = {
            'Rings': 'Кольца',
            'Earrings': 'Серьги',
            'Pendants': 'Подвески',
            'Bracelets': 'Браслеты'
        }
        
        # Build images array
        images = []
        for img in [img_front, img_side, img_top, img_model]:
            path = get_image_path(product_id, img)
            if path:
                images.append(path)
        
        product = {
            'id': int(product_id.replace('P', '')),
            'sku': product_id,
            'name': name_display or name_std,
            'nameEn': name_std,
            'category': category_mapping.get(category, category),
            'categoryEn': category,
            'productType': product_type,
            'metalType': metal_type,
            'goldWeight': gold_weight,
            'gemstoneType': gemstone_type,
            'totalCarat': total_carat,
            'mainStoneCarat': main_stone_carat,
            'diamondColor': diamond_color,
            'diamondClarity': diamond_clarity,
            'diamondCut': diamond_cut,
            'certificateType': certificate_type,
            'price': convert_price_to_rubles(price_usd),
            'priceUsd': price_usd,
            'description': description or '',
            'descriptionEn': description or '',  # Could translate later
            'careInstructions': care_instructions or '',
            'images': images,
            'altText': alt_text or '',
            'seoTags': seo_tags or ''
        }
        
        products.append(product)
    
    # Generate TypeScript file
    ts_content = '''export interface Product {
  id: number;
  sku: string;
  name: string;
  nameEn: string;
  category: string;
  categoryEn: string;
  productType: string;
  metalType: string;
  goldWeight: number | null;
  gemstoneType: string;
  totalCarat: number | null;
  mainStoneCarat: number | null;
  diamondColor: string;
  diamondClarity: string;
  diamondCut: string;
  certificateType: string;
  price: string;
  priceUsd: number | null;
  description: string;
  descriptionEn: string;
  careInstructions: string;
  images: string[];
  altText: string;
  seoTags: string;
}

export const products: Product[] = '''
    
    ts_content += json.dumps(products, indent=2, ensure_ascii=False)
    ts_content += ';\n\nexport const categories = [\'Все\', \'Кольца\', \'Серьги\', \'Подвески\', \'Браслеты\'];\n'
    ts_content += "\nexport const categoriesEn = ['All', 'Rings', 'Earrings', 'Pendants', 'Bracelets'];\n"
    
    with open('src/data/products.ts', 'w', encoding='utf-8') as f:
        f.write(ts_content)
    
    print(f'✅ Converted {len(products)} products to TypeScript')

if __name__ == '__main__':
    main()
