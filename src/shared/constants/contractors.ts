import {
    Car,
    Cpu,
    Hammer,
    Home,
    Settings,
    Users,
    Wrench,
    Zap,
} from "lucide-react";

const contractorCategories = {
    "Labour Supply": {
        icon: Users,
        color: "text-purple-600",
        bgColor: "bg-purple-50",
        contractors: [
            {
                name: "Labour Provider",
                description:
                    "Supplies skilled and unskilled labour for construction, cleaning, loading, site work and more...",
                icon: "👷",
            },
        ],
    },
    "Construction & Building": {
        icon: Hammer,
        color: "text-orange-600",
        bgColor: "bg-orange-50",
        contractors: [
            {
                name: "Electrician",
                description:
                    "Installs and repairs electrical wiring and fittings.",
                icon: "🔌",
            },
            {
                name: "Plumber",
                description:
                    "Installs and fixes pipes, taps, and drainage systems.",
                icon: "🚰",
            },
            {
                name: "Mason",
                description:
                    "Builds walls and structures using bricks and cement.",
                icon: "🧱",
            },
            {
                name: "Tiler",
                description: "Lays and polishes floor and wall tiles.",
                icon: "🪞",
            },
            {
                name: "Painter",
                description:
                    "Applies wall paint and finishes to interiors and exteriors.",
                icon: "🎨",
            },
            {
                name: "Plasterer",
                description: "Smoothens walls using plaster or cement mix.",
                icon: "🪣",
            },
            {
                name: "Welder",
                description: "Joins metal parts for gates, grills, and frames.",
                icon: "⚙️",
            },
            {
                name: "Roofer",
                description: "Builds and repairs roofs with tiles or sheets.",
                icon: "🏠",
            },
            {
                name: "Concrete Worker",
                description:
                    "Prepares and pours concrete for slabs and columns.",
                icon: "🏗️",
            },
            {
                name: "Stone Mason",
                description: "Shapes and fits stones for construction.",
                icon: "🪨",
            },
            {
                name: "Waterproofing Specialist",
                description:
                    "Prevents leakage and dampness in walls and roofs.",
                icon: "💧",
            },
            {
                name: "Fabricator",
                description: "Makes custom metal doors, railings, and grills.",
                icon: "🔩",
            },
            {
                name: "Scaffolding Worker",
                description: "Erects scaffolding for high-rise work.",
                icon: "🪜",
            },
            {
                name: "Demolition Contractor",
                description: "Breaks and clears old structures.",
                icon: "💥",
            },
        ],
    },

    "Home Maintenance & Repair": {
        icon: Home,
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        contractors: [
            {
                name: "House Cleaner",
                description: "Cleans and maintains homes.",
                icon: "🧹",
            },
            {
                name: "Pest Control",
                description: "Removes cockroaches, termites, and insects.",
                icon: "🐜",
            },
            {
                name: "Locksmith",
                description: "Repairs and replaces locks and keys.",
                icon: "🔑",
            },
            {
                name: "Appliance Repair",
                description:
                    "Fixes washing machines, fridges, and other devices.",
                icon: "🔧",
            },
            {
                name: "Furniture Repair",
                description: "Repairs wooden furniture and fittings.",
                icon: "🪑",
            },
            {
                name: "Window Repair",
                description: "Fixes or replaces broken windows and glass.",
                icon: "🪟",
            },
            {
                name: "Sofa Cleaner",
                description: "Cleans sofas and upholstery.",
                icon: "🛋️",
            },
            {
                name: "Water Tank Cleaner",
                description: "Cleans and disinfects overhead tanks.",
                icon: "🛢️",
            },
            {
                name: "Handyman",
                description: "Fixes small household issues and fittings.",
                icon: "🛠️",
            },
            {
                name: "Plumbing Repair",
                description: "Fixes leaking taps and small pipe issues.",
                icon: "🚿",
            },
            {
                name: "AC Technician",
                description: "Services and repairs air conditioners.",
                icon: "🌬️",
            },
            {
                name: "RO Technician",
                description: "Installs and repairs water purifiers.",
                icon: "💧",
            },
        ],
    },

    "Outdoor & Landscaping": {
        icon: Wrench,
        color: "text-green-600",
        bgColor: "bg-green-50",
        contractors: [
            {
                name: "Gardener",
                description: "Maintains gardens, lawns, and plants.",
                icon: "🌿",
            },
            {
                name: "Landscaper",
                description: "Designs and beautifies outdoor spaces.",
                icon: "🌳",
            },
            {
                name: "Tree Trimmer",
                description: "Cuts and maintains trees safely.",
                icon: "🌲",
            },
            {
                name: "Paver",
                description: "Lays outdoor tiles, pathways, and driveways.",
                icon: "🧱",
            },
            {
                name: "Fence Installer",
                description: "Builds and installs property fences.",
                icon: "🚧",
            },
            {
                name: "Outdoor Lighting",
                description: "Sets up outdoor lights and wiring.",
                icon: "💡",
            },
            {
                name: "Garden Cleaner",
                description: "Clears leaves and maintains clean surroundings.",
                icon: "🧺",
            },
        ],
    },

    "Automotive & Mechanical": {
        icon: Car,
        color: "text-gray-700",
        bgColor: "bg-gray-50",
        contractors: [
            {
                name: "Auto Mechanic",
                description: "Repairs and services cars.",
                icon: "🚗",
            },
            {
                name: "Bike Mechanic",
                description: "Fixes motorcycles and scooters.",
                icon: "🏍️",
            },
            {
                name: "Car Electrician",
                description: "Repairs vehicle wiring and batteries.",
                icon: "🔋",
            },
            {
                name: "Denter Painter",
                description: "Fixes car body dents and repainting.",
                icon: "🎨",
            },
            {
                name: "Car Washer",
                description: "Washes and cleans vehicles.",
                icon: "🧽",
            },
            {
                name: "Tire Specialist",
                description: "Changes and repairs tires.",
                icon: "🛞",
            },
            {
                name: "Truck Mechanic",
                description: "Repairs and services heavy vehicles.",
                icon: "🚚",
            },
        ],
    },

    "Specialized Installation": {
        icon: Zap,
        color: "text-yellow-600",
        bgColor: "bg-yellow-50",
        contractors: [
            {
                name: "Solar Panel Installer",
                description: "Installs rooftop solar systems.",
                icon: "☀️",
            },
            {
                name: "Inverter Technician",
                description: "Installs and repairs inverters and batteries.",
                icon: "🔋",
            },
            {
                name: "Lift Technician",
                description: "Maintains and repairs lifts and elevators.",
                icon: "🛗",
            },
            {
                name: "Generator Mechanic",
                description: "Repairs and services generators.",
                icon: "⚙️",
            },
            {
                name: "Pump Mechanic",
                description: "Fixes and installs water motors.",
                icon: "🚰",
            },
            {
                name: "Boring Contractor",
                description: "Drills borewells for water.",
                icon: "🕳️",
            },
            {
                name: "Fire Alarm Installer",
                description: "Sets up fire alarm systems.",
                icon: "🚨",
            },
        ],
    },

    "Industrial & Heavy Equipment": {
        icon: Settings,
        color: "text-red-600",
        bgColor: "bg-red-50",
        contractors: [
            {
                name: "Crane Operator",
                description: "Operates cranes for construction work.",
                icon: "🏗️",
            },
            {
                name: "Excavator Operator",
                description: "Handles excavation and digging machinery.",
                icon: "🚜",
            },
            {
                name: "Forklift Operator",
                description: "Moves heavy materials in warehouses.",
                icon: "🏭",
            },
            {
                name: "Boilermaker",
                description: "Builds and maintains boilers and tanks.",
                icon: "🔥",
            },
            {
                name: "Industrial Electrician",
                description: "Handles wiring in factories and plants.",
                icon: "⚡",
            },
            {
                name: "Welder (Heavy)",
                description: "Joins steel frames and large structures.",
                icon: "🔩",
            },
        ],
    },

    "Finishing & Detailing": {
        icon: Cpu,
        color: "text-indigo-600",
        bgColor: "bg-indigo-50",
        contractors: [
            {
                name: "Interior Painter",
                description: "Paints and textures indoor walls.",
                icon: "🎨",
            },
            {
                name: "POP Worker",
                description: "Creates ceiling and wall designs using POP.",
                icon: "🏛️",
            },
            {
                name: "False Ceiling Expert",
                description: "Installs gypsum and PVC ceilings.",
                icon: "🪵",
            },
            {
                name: "Marble Polisher",
                description: "Polishes marble flooring for shine.",
                icon: "🪩",
            },
            {
                name: "Tile Fixer",
                description: "Lays ceramic and vitrified tiles.",
                icon: "🧱",
            },
            {
                name: "Grill Maker",
                description: "Builds window and balcony grills.",
                icon: "🪟",
            },
            {
                name: "Glass Fitter",
                description: "Installs glass doors and partitions.",
                icon: "🪞",
            },
        ],
    },
};

export default contractorCategories;
