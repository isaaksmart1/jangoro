import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

export function NumberOfResponses({ files, fileCounts, setFileCounts }: any) {
  useEffect(() => {
    let promises: any = [];

    Array.from(files).forEach((file: any) => {
      const promise = new Promise((resolve) => {
        Papa.parse(file.file, {
          complete: (result: any) => {
            // Clean up the rows by removing empty ones
            const validRows = result.data.filter((row: any) =>
              Object.values(row).some((value) => value !== ""),
            );
            const rowCount = validRows.length; // No need to subtract 1 for the header if you've filtered out empty rows
            resolve({ name: file.name, count: rowCount });
          },
          header: true, // assuming first row is a header
        });
      });

      promises.push(promise);
    });

    Promise.all(promises)
      .then((counts: any) => {
        setFileCounts(counts);
      })
      .catch((error) => {
        console.error("Error processing files:", error);
      });
  }, [files]);

  return (
    <div style={{ marginRight: 24, width: "100%" }}>
      {fileCounts.length > 0 && (
        <BarChart width={600} maxBarSize={96} height={400} data={fileCounts}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#8884d8" />
        </BarChart>
      )}
    </div>
  );
}
