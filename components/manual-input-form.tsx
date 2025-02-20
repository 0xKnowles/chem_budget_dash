"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function ManualInputForm({ onSubmit }: { onSubmit: () => void }) {
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    console.log("Form submitted")
    onSubmit()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label htmlFor="date" className="text-xs">
            Date
          </Label>
          <Input id="date" type="date" required className="h-8" />
        </div>
        <div>
          <Label htmlFor="pesticide" className="text-xs">
            Pesticide
          </Label>
          <Input id="pesticide" required className="h-8" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label htmlFor="amount" className="text-xs">
            Amount (L)
          </Label>
          <Input id="amount" type="number" step="0.01" required className="h-8" />
        </div>
        <div>
          <Label htmlFor="application-method" className="text-xs">
            Method
          </Label>
          <Select required>
            <SelectTrigger id="application-method" className="h-8">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="boom-spray">Boom Spray</SelectItem>
              <SelectItem value="fogging">Fogging</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <Label htmlFor="area" className="text-xs">
          Area Treated (m²)
        </Label>
        <Input id="area" type="number" required className="h-8" />
      </div>
      <Button type="submit" className="w-full">
        Submit
      </Button>
    </form>
  )
}

