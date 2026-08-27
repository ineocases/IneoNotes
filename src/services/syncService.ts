import { db } from "../database/db";
import { firebaseService } from "./firebaseService";
import { isFirebaseConfigured } from "../config/firebase";

export async function flushSyncQueue(userId: string): Promise<void> {
  if (!navigator.onLine || !isFirebaseConfigured) return;
  const jobs = await db.syncQueue.orderBy("updatedAt").toArray();
  for (const job of jobs) {
    try {
      if (job.kind === "notebook") await firebaseService.saveNotebook(userId, job.payload as never);
      if (job.kind === "page") await firebaseService.savePage(userId, job.payload as never);
      await db.syncQueue.delete(job.id);
    } catch {
      await db.syncQueue.update(job.id, { attempts: job.attempts + 1 });
    }
  }
}