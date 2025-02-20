import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const data = [
  { chemical: "Acetone", usage: "300 L", budget: "350 L", variance: "-14.3%" },
  { chemical: "Ethanol", usage: "250 L", budget: "200 L", variance: "+25%" },
  { chemical: "Methanol", usage: "180 L", budget: "200 L", variance: "-10%" },
  { chemical: "Hydrochloric Acid", usage: "100 L", budget: "120 L", variance: "-16.7%" },
  { chemical: "Sulfuric Acid", usage: "90 L", budget: "80 L", variance: "+12.5%" },
]

export function ChemicalUsageTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Chemical</TableHead>
          <TableHead>Usage</TableHead>
          <TableHead>Budget</TableHead>
          <TableHead>Variance</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row) => (
          <TableRow key={row.chemical}>
            <TableCell>{row.chemical}</TableCell>
            <TableCell>{row.usage}</TableCell>
            <TableCell>{row.budget}</TableCell>
            <TableCell>{row.variance}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

