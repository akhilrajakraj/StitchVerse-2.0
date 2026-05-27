from django.core.management.base import BaseCommand
from apps.orders.models import GarmentCategory

class Command(BaseCommand):
    help = 'Seeds the database with production-grade Garment Categories'

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.WARNING("Starting StitchVerse garment database seeding..."))

        garments_data = [
            # ──────────────────────────────────────────────
            # TRADITIONAL KERALA & SOUTH INDIAN
            # ──────────────────────────────────────────────
            {
                "name": "Kasavu Saree Blouse", "department": "Women's Ethnic",
                "req": ["chest", "bust", "under_bust", "waist", "shoulder", "arm_length", "sleeve_length", "front_neck_depth", "back_neck_depth"]
            },
            {
                "name": "Pattupavada (Silk Skirt) & Blouse", "department": "Women's Ethnic",
                "req": ["chest", "waist", "hip", "height", "shoulder", "sleeve_length"]
            },
            {
                "name": "Traditional Silk Jubba / Kurta", "department": "Men's Ethnic",
                "req": ["neck", "shoulder", "chest", "waist", "hip", "sleeve_length", "height"]
            },
            {
                "name": "Custom Fit Kerala Mundu (Dhoti)", "department": "Men's Ethnic",
                "req": ["waist", "hip", "height", "inseam", "outseam"]
            },
            
            # ──────────────────────────────────────────────
            # INDIAN BRIDAL & FESTIVE
            # ──────────────────────────────────────────────
            {
                "name": "Bridal Lehenga Choli", "department": "Women's Ethnic",
                "req": ["chest", "bust", "under_bust", "waist", "hip", "height", "shoulder", "sleeve_length", "front_neck_depth", "back_neck_depth"]
            },
            {
                "name": "Men's Wedding Sherwani", "department": "Men's Ethnic",
                "req": ["neck", "shoulder", "chest", "waist", "hip", "sleeve_length", "bicep", "wrist", "height", "inseam", "outseam"]
            },
            {
                "name": "Bandhgala / Jodhpuri Suit", "department": "Men's Ethnic",
                "req": ["neck", "shoulder", "chest", "waist", "hip", "sleeve_length", "wrist", "inseam", "outseam", "thigh"]
            },
            {
                "name": "Classic Salwar Kameez", "department": "Women's Ethnic",
                "req": ["shoulder", "chest", "bust", "waist", "hip", "sleeve_length", "height", "inseam", "outseam", "ankle"]
            },
            {
                "name": "Sharara Suit", "department": "Women's Ethnic",
                "req": ["shoulder", "chest", "bust", "waist", "hip", "thigh", "knee", "height"]
            },
            {
                "name": "Nehru / Modi Jacket", "department": "Men's Ethnic",
                "req": ["neck", "shoulder", "chest", "waist", "hip", "height"]
            },

            # ──────────────────────────────────────────────
            # THE LEGACY PHP OUTFITS (Migrated)
            # ──────────────────────────────────────────────
            {
                "name": "Anarkali Suit – Festive Wear", "department": "Women's Wear",
                "req": ["height", "shoulder", "chest", "bust", "waist", "hip", "sleeve_length", "arm_length", "inseam", "outseam"]
            },
            {
                "name": "Office Kurti – Formal", "department": "Women's Wear",
                "req": ["height", "shoulder", "chest", "bust", "waist", "hip", "sleeve_length"]
            },
            {
                "name": "Mandarin Collar Shirt with Palazzo", "department": "Women's Wear",
                "req": ["neck", "shoulder", "chest", "bust", "waist", "hip", "sleeve_length", "wrist", "inseam", "outseam"]
            },
            {
                "name": "Formal Linen Trousers", "department": "Women's Wear",
                "req": ["waist", "hip", "thigh", "knee", "inseam", "outseam", "ankle"]
            },
            {
                "name": "Silk Bridal Blouse", "department": "Women's Wear",
                "req": ["neck", "shoulder", "chest", "bust", "waist", "arm_length", "sleeve_length"]
            },
            {
                "name": "A-Line Midi Skirt", "department": "Women's Skirts",
                "req": ["waist", "hip", "height"]
            },
            {
                "name": "Mermaid Skirt", "department": "Women's Skirts",
                "req": ["waist", "hip", "knee", "height"]
            },
            {
                "name": "Classic Formal Shirt", "department": "Men's Wear",
                "req": ["neck", "shoulder", "chest", "waist", "sleeve_length", "wrist"]
            },
            {
                "name": "Slim Fit Chinos", "department": "Men's Wear",
                "req": ["waist", "hip", "thigh", "knee", "inseam", "ankle"]
            },
            {
                "name": "Tailored Wool Trousers", "department": "Men's Wear",
                "req": ["waist", "hip", "thigh", "knee", "inseam", "outseam"]
            },
            {
                "name": "Cargo Pants", "department": "Men's Wear",
                "req": ["waist", "hip", "thigh", "inseam", "outseam"]
            },
            {
                "name": "Oversized Hoodie", "department": "Unisex Streetwear",
                "req": ["shoulder", "chest", "sleeve_length", "height"]
            },
            {
                "name": "Athletic Joggers", "department": "Unisex Streetwear",
                "req": ["waist", "hip", "thigh", "inseam", "ankle"]
            },

            # ──────────────────────────────────────────────
            # WESTERN FORMAL & GLOBAL STYLES
            # ──────────────────────────────────────────────
            {
                "name": "Men's Two-Piece Business Suit", "department": "Men's Formal",
                "req": ["neck", "shoulder", "chest", "waist", "hip", "sleeve_length", "bicep", "wrist", "height", "inseam", "outseam", "thigh", "ankle"]
            },
            {
                "name": "Men's Classic Tuxedo", "department": "Men's Formal",
                "req": ["neck", "shoulder", "chest", "waist", "hip", "sleeve_length", "wrist", "inseam", "outseam", "thigh"]
            },
            {
                "name": "Women's Double-Breasted Blazer", "department": "Women's Formal",
                "req": ["shoulder", "chest", "bust", "waist", "hip", "sleeve_length", "bicep", "wrist"]
            },
            {
                "name": "Evening Gown / Maxi Dress", "department": "Women's Formal",
                "req": ["shoulder", "chest", "bust", "under_bust", "waist", "hip", "height", "front_neck_depth"]
            },
            {
                "name": "Trench Coat", "department": "Unisex Outerwear",
                "req": ["shoulder", "chest", "waist", "hip", "sleeve_length", "height", "bicep"]
            },
            {
                "name": "Cheongsam (Qipao)", "department": "Women's Ethnic",
                "req": ["neck", "shoulder", "chest", "bust", "waist", "hip", "height"]
            },
            {
                "name": "Kaftan / Abaya", "department": "Women's Ethnic",
                "req": ["shoulder", "chest", "height", "sleeve_length"]
            }
        ]

        created_count = 0
        updated_count = 0

        for item in garments_data:
            # update_or_create checks if a garment with this exact name and department exists.
            # If yes, it updates the requirements. If no, it creates a new one.
            obj, created = GarmentCategory.objects.update_or_create(
                name=item["name"],
                department=item["department"],
                defaults={
                    "required_measurements": item["req"],
                    "is_active": True
                }
            )
            
            if created:
                created_count += 1
            else:
                updated_count += 1

        self.stdout.write(self.style.SUCCESS(
            f"Successfully seeded database! \n"
            f"- Created: {created_count} new garments.\n"
            f"- Updated: {updated_count} existing garments."
        ))