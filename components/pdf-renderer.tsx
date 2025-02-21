"use client"

import { useEffect } from "react"
import { pdf } from "@react-pdf/renderer"
import { Document, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer"

// Register fonts
Font.register({
  family: "Inter",
  src: "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2",
})

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    padding: 30,
    fontFamily: "Inter",
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
    color: "#1f2937",
  },
  subheader: {
    fontSize: 18,
    marginBottom: 10,
    color: "#374151",
  },
  text: {
    fontSize: 12,
    marginBottom: 5,
    color: "#4b5563",
  },
  table: {
    display: "table",
    width: "100%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginVertical: 10,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    minHeight: 30,
    alignItems: "center",
  },
  tableHeader: {
    backgroundColor: "#f3f4f6",
  },
  tableCell: {
    flex: 1,
    padding: 5,
    fontSize: 10,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginVertical: 10,
  },
  statCard: {
    width: "50%",
    padding: 10,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: "center",
    fontSize: 10,
    color: "#9ca3af",
  },
})

// PDF Document Component
const ReportDocument = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.header}>Spray Application Report</Text>

      {/* Date and Overview */}
      <View style={styles.section}>
        <Text style={styles.subheader}>Overview</Text>
        <Text style={styles.text}>Generated: {new Date().toLocaleDateString()}</Text>
        <Text style={styles.text}>Month: {data.selectedMonth}</Text>
      </View>

      {/* Key Metrics */}
      <View style={styles.section}>
        <Text style={styles.subheader}>Key Metrics</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.text}>Total Applications: {data.totalUsage.sprayCount + data.totalUsage.fogCount}</Text>
            <Text style={styles.text}>Sprays: {data.totalUsage.sprayCount}</Text>
            <Text style={styles.text}>Fogs: {data.totalUsage.fogCount}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.text}>Total Bays Treated: {data.totalUsage.totalBays}</Text>
            <Text style={styles.text}>Full Range Applications: {data.totalUsage.fullRangeApplications}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.text}>Monthly Budget: ${data.latestMonthData.budget.toLocaleString()}</Text>
            <Text style={styles.text}>Spent This Month: ${data.latestMonthData.spent.toLocaleString()}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.text}>Average Price per Bay: ${data.averagePricePerBay.toFixed(2)}</Text>
          </View>
        </View>
      </View>

      {/* Most Used Chemicals */}
      <View style={styles.section}>
        <Text style={styles.subheader}>Most Used Chemicals</Text>
        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={styles.tableCell}>Chemical</Text>
            <Text style={styles.tableCell}>Usage Count</Text>
          </View>
          {data.mostUsedChemicals.slice(0, 3).map((chemical, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.tableCell}>{chemical.chemical}</Text>
              <Text style={styles.tableCell}>{chemical.count}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Recent Applications */}
      <View style={styles.section}>
        <Text style={styles.subheader}>Recent Applications</Text>
        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={styles.tableCell}>Date</Text>
            <Text style={styles.tableCell}>Chemicals</Text>
            <Text style={styles.tableCell}>Method</Text>
            <Text style={styles.tableCell}>Bays</Text>
            <Text style={styles.tableCell}>Price</Text>
          </View>
          {data.applications.slice(0, 5).map((app, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.tableCell}>{app.date.formatted}</Text>
              <Text style={styles.tableCell}>
                {[...app.sprayChemicals, ...app.fogChemicals].filter(Boolean).join(", ")}
              </Text>
              <Text style={styles.tableCell}>
                {app.sprayChemicals.some(Boolean) && app.fogChemicals.some(Boolean)
                  ? "Spray & Fog"
                  : app.sprayChemicals.some(Boolean)
                    ? "Spray"
                    : "Fog"}
              </Text>
              <Text style={styles.tableCell}>{app.bays.count}</Text>
              <Text style={styles.tableCell}>${app.price.toFixed(2)}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Footer */}
      <Text style={styles.footer}>Generated by Spray Application Dashboard • {new Date().toLocaleString()}</Text>
    </Page>
  </Document>
)

export default function PDFRenderer({ reportData, onComplete }) {
  useEffect(() => {
    const generatePDF = async () => {
      try {
        // Generate PDF blob
        const blob = await pdf(<ReportDocument data={reportData} />).toBlob()

        // Create download link
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.download = `spray-report-${reportData.selectedMonth?.toLowerCase() || "all"}.pdf`

        // Trigger download
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

        // Cleanup
        URL.revokeObjectURL(url)
        onComplete()
      } catch (error) {
        console.error("Error generating PDF:", error)
        onComplete()
      }
    }

    generatePDF()
  }, [reportData, onComplete])

  return null
}

