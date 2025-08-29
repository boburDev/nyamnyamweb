import { InstagramIcon, TelegrammIcon, YouTubeIcon } from "@/assets/icons";

export const links = [
    {
        title: 'Foydali havola',
        link: [
           {
            title:"Web ilova haqida"
           },
           {
            title:"Foydalanish shartlari"
           },
           {
            title:"Maxfiylik siyosati"
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
            title:'Jamoalar',
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
                id:2,
                icon: YouTubeIcon,
                path: '/'
            },
            {
                id:3,
                icon: InstagramIcon,
                path: '/'
            }
        ]
    }
]