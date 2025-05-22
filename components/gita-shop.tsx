"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ShoppingCart, Book, ExternalLink } from "lucide-react"

// Store links
const storeLinks = {
  gitaPress: {
    english: "https://gitapress.org/product/673f25be07174db38a587864",
    hindi: "https://gitapress.org/product/673f25be07174db38a587545",
  },
  flipkart: {
    english:
      "https://www.flipkart.com/srimadh-bhagawad-gita-yatharoop-english/p/itm330f0517d1935?pid=RBKGFH4GVZTBHUAK&lid=LSTRBKGFH4GVZTBHUAKXVFAZS&marketplace=FLIPKART&q=bhagwat+gita+english&store=bks&srno=s_1_2&otracker=search&otracker1=search&fm=Search&iid=b14ffddb-f02e-46bf-8c2a-d59ffafac84d.RBKGFH4GVZTBHUAK.SEARCH&ppt=sp&ppn=sp&ssid=yvhfh6oprk0000001744457991086&qH=964e5c21b5d58d0f",
    hindi: "https://www.flipkart.com/hi/srimad-bhagavad-gita-yatharup-hindi/p/itmafe6c79bc775f",
  },
  amazon: {
    english:
      "https://www.amazon.in/Bhagvad-gita-as-english-new/dp/9384564192/ref=pd_vtp_d_sccl_1_4/261-8546889-2693460?pd_rd_w=TD7RD&content-id=amzn1.sym.f7d06212-3555-43aa-92e8-0a66aa167653&pf_rd_p=f7d06212-3555-43aa-92e8-0a66aa167653&pf_rd_r=0GMKT7T65M99TSB8E9Z3&pd_rd_wg=9qD0e&pd_rd_r=3e6b0a60-f0d4-4f92-aa92-15b122107c76&pd_rd_i=9384564192&psc=1",
    hindi:
      "https://www.amazon.in/Shrimad-Bhagwat-Geeta-Yatharoop-Hindi/dp/938598618X/ref=sr_1_4?crid=ZNUVP8EML0AD&dib=eyJ2IjoiMSJ9.MdCNAYXIyQaEUIAZL1EIhwYKbN1qiPX4FIAwHhKGkptS55e5POIcN3uJVdoBRAUKagqygGQRqvxKdDf9F0F9VqpaVlB7B9eSoKsH3hLE1DCT2QiZPquJnjnBU6jpEIzZFHWHBJ8gU_J3XgDuwS4iXSPwKe4jZbUE_32FfqbuKCNCNK_goOFcN34T7TkK1uP21vmKdY9QQaxGErQimHv4I8qwcTsKWDqEYfrX2A4UUIs.jNX_GQqNHv6W1o_QV7W3CbbJp-SnoUfwLDp0AAN1ryc&dib_tag=se&keywords=bhagavad+gita&qid=1744458093&s=books&sprefix=bhagwat+gita+%2Cstripbooks%2C275&sr=1-4",
  },
}

export function GitaShop() {
  return (
    <Tabs defaultValue="english" className="w-full">
      <div className="flex justify-center mb-8">
        <TabsList className="bg-amber-950/50 border border-amber-800/30">
          <TabsTrigger value="english" className="data-[state=active]:bg-amber-700 data-[state=active]:text-white">
            English Edition
          </TabsTrigger>
          <TabsTrigger value="hindi" className="data-[state=active]:bg-amber-700 data-[state=active]:text-white">
            Hindi Edition
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="english" className="mt-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ShopCard
            store="Gita Press"
            description="Original publisher with authentic translation"
            price="₹150"
            link={storeLinks.gitaPress.english}
            delay={0.1}
          />
          <ShopCard
            store="Flipkart"
            description="Fast delivery with easy returns"
            price="₹175"
            link={storeLinks.flipkart.english}
            delay={0.2}
          />
          <ShopCard
            store="Amazon"
            description="Available with Prime delivery"
            price="₹199"
            link={storeLinks.amazon.english}
            delay={0.3}
          />
        </div>
      </TabsContent>

      <TabsContent value="hindi" className="mt-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ShopCard
            store="Gita Press"
            description="प्रामाणिक हिंदी अनुवाद के साथ"
            price="₹120"
            link={storeLinks.gitaPress.hindi}
            delay={0.1}
          />
          <ShopCard
            store="Flipkart"
            description="तेज़ डिलीवरी और आसान वापसी"
            price="₹145"
            link={storeLinks.flipkart.hindi}
            delay={0.2}
          />
          <ShopCard
            store="Amazon"
            description="प्राइम डिलीवरी के साथ उपलब्ध"
            price="₹165"
            link={storeLinks.amazon.hindi}
            delay={0.3}
          />
        </div>
      </TabsContent>
    </Tabs>
  )
}

interface ShopCardProps {
  store: string
  description: string
  price: string
  link: string
  delay: number
}

function ShopCard({ store, description, price, link, delay }: ShopCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay }}
    >
      <Card className="bg-amber-950/50 border-amber-800/30 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-700/10 to-amber-900/20 z-0"></div>
        <CardHeader className="relative z-10">
          <CardTitle className="text-amber-300 flex items-center gap-2">
            <Book className="h-5 w-5" />
            {store}
          </CardTitle>
          <CardDescription className="text-amber-200/70">{description}</CardDescription>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="bg-amber-900/30 p-4 rounded-lg border border-amber-800/30 flex items-center justify-between">
            <span className="text-amber-300 font-bold text-xl">{price}</span>
            <span className="text-amber-200/70 text-sm">Paperback</span>
          </div>
        </CardContent>
        <CardFooter className="relative z-10">
          <a href={link} target="_blank" rel="noopener noreferrer" className="w-full">
            <Button className="w-full bg-amber-700 hover:bg-amber-600 text-white">
              <ShoppingCart className="mr-2 h-4 w-4" /> Buy Now <ExternalLink className="ml-2 h-3 w-3" />
            </Button>
          </a>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
