import { InstagramIcon, TelegrammIcon, User, YouTubeIcon } from "@/assets/icons";
import { ShoppingCart, House, Heart } from 'lucide-react'

export const links = [
    {
        title: 'Foydali havola',
        link: [
            {
                title: "Web ilova haqida"
            },
            {
                title: "Foydalanish shartlari"
            },
            {
                title: "Maxfiylik siyosati"
            }
        ]
    },
    {
        title: 'Kompaniya',
        link: [
            {
                title: 'Biz haqimizda',
            },
            {
                title: 'Karyera',
            },
            {
                title: 'FAQs',
            },
            {
                title: 'Jamoalar',
            }
        ]
    },
    {
        title: 'Ijtimoiy tarmoq',
        socials: [
            {
                id: 1,
                icon: TelegrammIcon,
                path: '/'
            },
            {
                id: 2,
                icon: YouTubeIcon,
                path: '/'
            },
            {
                id: 3,
                icon: InstagramIcon,
                path: '/'
            }
        ]
    }
]


export const FooterData = () => [
    {
        name: 'Bosh sahifa',
        path: "/",
        icon: House,
    },
    {
        name: 'Cart',
        path: "/cart",
        icon: ShoppingCart,
    },
    {
        name: 'Sevimlilar',
        path: "/favourites",
        icon: Heart,
    },
    {
        name: 'Profil',
        path: "/profile",
        icon: User,
    },
]