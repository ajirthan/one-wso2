// PROTOTYPE (branch prototype/mis-look) — throwaway, never merge.
//
// D8: ONE filled-primary "Export ▾" menu offering CSV · Excel · PDF, at every
// export point. The prototype needs the MENU, not working exports: Excel still
// writes the workbook the port already builds (so the button does something
// real), CSV and PDF only say what they would do.
//
//   A, C  the source's `.export-csv-btn`: filled primary, uppercase 12px/600,
//         4px radius
//   B     Oxygen `Button variant="contained"`

import { useState, type MouseEvent } from "react";
import { Button, ListItemIcon, ListItemText, Menu, MenuItem, Typography } from "@wso2/oxygen-ui";
import { ChevronDownIcon, DownloadIcon, FileSpreadsheetIcon, FileTextIcon, FileIcon } from "@wso2/oxygen-ui-icons-react";
import { saveMisWorkbook, type MisWorkbookSpec } from "../export/misWorkbook";
import { useMisLook } from "./misLookPrototype";
import { faithfulExportSx } from "./misLookTokens";

export default function PrototypeExportMenu({
  workbook,
  filename,
}: {
  /** The workbook the Excel item writes — the port's existing builder. Optional where none exists yet (Opportunities). */
  workbook?: () => MisWorkbookSpec;
  /** The port's `misExportFilename` (ends in `.xlsx`); the item swaps the extension. */
  filename: () => string;
}) {
  const look = useMisLook();
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const [working, setWorking] = useState(false);
  const [note, setNote] = useState("");

  const close = () => setAnchor(null);
  const base = () => filename().replace(/\.xlsx$/i, "");

  const excel = async () => {
    close();
    if (!workbook) {
      setNote("No workbook builder on this table yet.");
      return;
    }
    setWorking(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 0));
      await saveMisWorkbook(workbook(), `${base()}.xlsx`);
    } catch {
      setNote("Couldn't write the file.");
    } finally {
      setWorking(false);
    }
  };

  const stub = (kind: "CSV" | "PDF") => () => {
    close();
    // Prototype: the real implementation writes raw unscaled numbers (CSV) or
    // the table as seen, landscape A4 via jsPDF (PDF) — see D8.
    console.info(`[mis-prototype] would export ${kind}: ${base()}.${kind.toLowerCase()}`);
    setNote(`${kind} export is not wired in the prototype.`);
    window.setTimeout(() => setNote(""), 2500);
  };

  return (
    <>
      {note && (
        <Typography variant="caption" color="text.secondary" role="status" sx={{ mr: 1 }}>
          {note}
        </Typography>
      )}
      <Button
        size="small"
        variant="contained"
        disabled={working}
        startIcon={<DownloadIcon size={14} />}
        endIcon={<ChevronDownIcon size={14} />}
        aria-haspopup="menu"
        aria-expanded={Boolean(anchor)}
        onClick={(event: MouseEvent<HTMLElement>) => setAnchor(event.currentTarget)}
        sx={look.gridHeader === "brand" ? faithfulExportSx : undefined}
      >
        {working ? "Exporting…" : "Export"}
      </Button>
      <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={close}>
        <MenuItem onClick={stub("CSV")}>
          <ListItemIcon><FileTextIcon size={16} /></ListItemIcon>
          <ListItemText primary="CSV" secondary="raw numbers, same columns" />
        </MenuItem>
        <MenuItem onClick={excel}>
          <ListItemIcon><FileSpreadsheetIcon size={16} /></ListItemIcon>
          <ListItemText primary="Excel" secondary="raw numbers with number formats" />
        </MenuItem>
        <MenuItem onClick={stub("PDF")}>
          <ListItemIcon><FileIcon size={16} /></ListItemIcon>
          <ListItemText primary="PDF" secondary="as seen, landscape A4" />
        </MenuItem>
      </Menu>
    </>
  );
}
