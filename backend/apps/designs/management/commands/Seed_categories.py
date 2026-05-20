import uuid
from django.core.management.base import BaseCommand
from django.utils.text import slugify
from apps.designs.models import DesignCategory

class Command(BaseCommand):
    help = "Seeds the DesignCategory database table with a high-fidelity fashion category tree taxonomy."

    def handle(self, *args, **options):
        self.stdout.write(self.style.MIGRATE_LABEL("Initializing StitchVerse Design Category Database Seeding Sequence..."))

        # Intensive structured hierarchy mapping data array setup
        category_tree = {
            "Traditional & Ethnic Wear": {
                "subcategories": [
                    "Lehengas & Bridal Gowns",
                    "Sarees & Blouses",
                    "Sherwanis & Indo-Western",
                    "Kurtas & Salwar Kameez",
                    "Dhotis & Mundus"
                ]
            },
            "Formal & Corporate Apparel": {
                "subcategories": [
                    "Two-Piece & Three-Piece Suits",
                    "Blazers & Tuxedos",
                    "Formal Button-Up Shirts",
                    "Trousers & Chinos",
                    "Pencil Skirts & Corporate Dresses"
                ]
            },
            "Casuals & Contemporary Wear": {
                "subcategories": [
                    "Casual Shirts & Tunic Tops",
                    "Maxi & Summer Dresses",
                    "Custom Denim Jackets",
                    "Trousers & Cargo Pants"
                ]
            },
            "Uniforms & Specialized Attire": {
                "subcategories": [
                    "School Uniform Sets",
                    "Medical Scrubs & Lab Coats",
                    "Corporate Staff Workwear",
                    "Hospitality & Chef Coats"
                ]
            },
            "Festive & Party Masterpieces": {
                "subcategories": [
                    "Evening Gowns & Cocktail Dresses",
                    "Bandhgala Suits",
                    "Anarkali Suits",
                    "Designer Waistcoats"
                ]
            }
        }

        records_created = 0

        # Processing loop logic execution node
        for parent_name, sub_data in category_tree.items():
            # Create or fetch parent configuration safely to prevent database duplication errors
            parent_slug = slugify(parent_name)
            parent_cat, created = DesignCategory.objects.get_or_create(
                slug=parent_slug,
                defaults={
                    "id": uuid.uuid4(),
                    "name": parent_name,
                    "parent": None
                }
            )
            
            if created:
                records_created += 1
                self.stdout.write(self.style.SUCCESS(f"Successfully cataloged Root Domain Category: [{parent_name}]"))

            # Processing sub-categories branch loop
            for sub_name in sub_data["subcategories"]:
                sub_slug = slugify(sub_name)
                _, sub_created = DesignCategory.objects.get_or_create(
                    slug=sub_slug,
                    defaults={
                        "id": uuid.uuid4(),
                        "name": sub_name,
                        "parent": parent_cat # Enforces structural tree connection!
                    }
                )
                
                if sub_created:
                    records_created += 1
                    self.stdout.write(self.style.SUCCESS(f"  -> Successfully appended subcategory block: [{sub_name}]"))

        self.stdout.write(self.style.SUCCESS(f"Seeding operation completed successfully. Total new database records written: {records_created}"))