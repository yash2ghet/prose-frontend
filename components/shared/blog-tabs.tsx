"use client"

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

export function BlogTabs() {
  return (
    <Tabs defaultValue="content">
      <TabsList variant="line">
        <TabsTrigger value="content">
          Content
        </TabsTrigger>

        <TabsTrigger value="seo">
          SEO
        </TabsTrigger>

        <TabsTrigger value="history">
          History
        </TabsTrigger>
      </TabsList>

      <TabsContent value="content">
        Content goes here
      </TabsContent>

      <TabsContent value="seo">
        SEO goes here
      </TabsContent>

      <TabsContent value="history">
        History goes here
      </TabsContent>
    </Tabs>
  )
}