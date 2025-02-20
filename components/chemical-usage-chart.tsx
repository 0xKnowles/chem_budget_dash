"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "@/components/ui/chart"

const data = [
  { name: "Jan", usage: 400, budget: 500 },
  { name: "Feb", usage: 300, budget: 500 },
  { name: "Mar", usage: 550, budget: 500 },
  { name: "Apr", usage: 450, budget: 500 },
  { name: "May", usage: 480, budget: 500 },
  { name: "Jun", usage: 520, budget: 500 },
]

export function ChemicalUsageChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Chemical Usage vs Budget</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Bar dataKey="usage" fill="#8884d8" name="Usage" />
            <Bar dataKey="budget" fill="#82ca9d" name="Budget" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

