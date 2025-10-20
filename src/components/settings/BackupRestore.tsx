import { useState } from "react";
import { save, open } from "@tauri-apps/plugin-dialog";
import { writeTextFile, readTextFile } from "@tauri-apps/plugin-fs";
import { toaster } from "@/components/ui/toaster";
import { useDialog } from "@/context/dialog";
import {
  exportAllData,
  importAllData,
  type BackupData,
} from "@/database/backup";
import { Download, Upload } from "lucide-react";
import clsx from "clsx";

const BackupRestore = () => {
  const { confirm, alert } = useDialog();
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);

  const handleBackup = async () => {
    setIsBackingUp(true);
    try {
      // Export all data from database
      const { data, error } = await exportAllData();

      if (error) {
        toaster.create({
          title: "Backup Failed",
          description: `Failed to export data: ${error}`,
          type: "error",
        });
        return;
      }

      if (!data) {
        toaster.create({
          title: "Backup Failed",
          description: "No data to backup",
          type: "error",
        });
        return;
      }

      // Generate filename with current date
      const now = new Date();
      const dateString = now.toISOString().split("T")[0]; // YYYY-MM-DD format
      const defaultFilename = `open2e-backup-${dateString}.json`;

      // Open save dialog
      const filePath = await save({
        title: "Save Backup File",
        filters: [
          {
            name: "JSON Files",
            extensions: ["json"],
          },
        ],
        defaultPath: defaultFilename,
      });

      if (!filePath) {
        return; // User cancelled
      }

      // Write backup data to file
      await writeTextFile(filePath, JSON.stringify(data, null, 2));

      toaster.create({
        title: "Backup Successful",
        description: `Data backed up to ${filePath.split("/").pop()}`,
        type: "success",
      });
    } catch (error) {
      toaster.create({
        title: "Backup Failed",
        description: `An error occurred: ${error}`,
        type: "error",
      });
    } finally {
      setIsBackingUp(false);
    }
  };

  const handleRestore = async () => {
    setIsRestoring(true);
    try {
      // Open file dialog to select backup file
      const filePath = await open({
        title: "Select Backup File",
        filters: [
          {
            name: "JSON Files",
            extensions: ["json"],
          },
        ],
        multiple: false,
      });

      if (!filePath) {
        return; // User cancelled
      }

      // Read and parse backup file
      const fileContent = await readTextFile(filePath);
      let backupData: BackupData;

      try {
        backupData = JSON.parse(fileContent);
      } catch (parseError) {
        toaster.create({
          title: "Invalid Backup File",
          description: "The selected file is not valid JSON",
          type: "error",
        });
        return;
      }

      // Show confirmation dialog
      const isConfirmed = await confirm({
        title: "Confirm Data Restore",
        description:
          "This will replace ALL existing data with the backup data. This action cannot be undone. Do you want to continue?",
      });

      if (!isConfirmed) {
        return;
      }

      // Import the backup data
      const { error } = await importAllData(backupData);

      if (error) {
        toaster.create({
          title: "Restore Failed",
          description: `Failed to restore data: ${error}`,
          type: "error",
        });
        return;
      }

      alert({
        title: "Restore Successful",
        description:
          "Data has been successfully restored from backup. Please Restart the application to see the changes.",
        mode: "SUCCESS",
        displayTime: 10000,
      });
    } catch (error) {
      toaster.create({
        title: "Restore Failed",
        description: `An error occurred: ${error}`,
        type: "error",
      });
    } finally {
      setIsRestoring(false);
    }
  };

  return (
    <div className="flex flex-col w-full gap-4 pb-4">
      <p className="text-base text-uGrayLight">
        Export your data to a JSON file or restore from a previous backup
      </p>

      <div className="w-full flex flex-row gap-4">
        <button
          onClick={handleBackup}
          disabled={isBackingUp || isRestoring}
          className={clsx(
            "flex-1 flex flex-row gap-2 items-center justify-center py-2 px-4 rounded-md text-sm font-medium transition-colors",
            "bg-primary text-background hover:bg-primary/90",
            "disabled:bg-uGrayLight disabled:text-uGrayLightLight disabled:cursor-not-allowed"
          )}
        >
          <Download className="h-4 w-4" />
          {isBackingUp ? "Creating Backup..." : "Create Backup"}
        </button>

        <button
          onClick={handleRestore}
          disabled={isBackingUp || isRestoring}
          className={clsx(
            "flex-1 flex flex-row gap-2 items-center justify-center py-2 px-4 rounded-md text-sm font-medium transition-colors",
            "bg-uGray text-background hover:bg-uGray/90",
            "disabled:bg-uGrayLight disabled:text-uGrayLightLight disabled:cursor-not-allowed"
          )}
        >
          <Upload className="h-4 w-4" />
          {isRestoring ? "Restoring Data..." : "Restore from Backup"}
        </button>
      </div>
    </div>
  );
};

export default BackupRestore;
