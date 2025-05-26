import { z } from "zod";
import {
  Circle,
  CheckCircle2,
  AlertCircle,
  XCircle,
  PauseCircle,
  Clock,
  ArrowDown,
  ArrowUp,
  AlertTriangle,
  Flame,
  FileText,
  Users,
  BarChart2,
  FileCheck2,
} from "lucide-react";

export const taskSchema = z.object({
  createdBy: z.string().trim().optional(),
  owner: z.string().trim().optional(),
  title: z
    .string()
    .min(2, "Tile is required.")
    .max(46, {
      message: "Title too long.",
    }),
  dueDate: z.date().optional().transform((str) => str?.toISOString()),
  status: z.string().trim().optional(),
  priority: z.string().trim().optional(),
  description: z.string().trim().max(255).optional(),
  label: z.string().trim().max(16).optional(),
  assignee: z.object({
    name: z.string().trim(),
    avatar: z.string().trim(),
  }).optional(),
  attachements: z.array(z.object({
    name: z.string().trim(),
    type: z.string().trim(),
    size: z.number(),
    url: z.string().url(),
  }).optional()).max(3, "3 Attachements max.").optional(),
});

export const taskUpdateSchema = taskSchema.omit({ title: true });

export const labels = [
  {
    value: "urgent",
    label: "Urgent",
    style: "border-none bg-[#f7eded] text-[#af4b4b]",
    icon: AlertTriangle,
  },
  {
    value: "marketing",
    label: "Marketing",
    style: "border-none bg-[#f7f7e8] text-[#b1ab1d]",
    icon: BarChart2,
  },
  {
    value: "document",
    label: "Document",
    style: "border-none bg-[#edf2fe] text-[#4976f4]",
    icon: FileText,
  },
  {
    value: "internal",
    label: "Internal",
    style: "border-none bg-[#fbf4ec] text-[#d28e3d]",
    icon: Users,
  },
  {
    value: "report",
    label: "Report",
    style: "border-none bg-[#eef5f0] text-[#589e67]",
    icon: FileCheck2,
  },
];

export const statuses = [
  {
    value: "backlog",
    label: "Backlog",
    icon: Clock,
    bg: "bg-white border rounded-xl shadow",
  },
  {
    value: "todo",
    label: "To-do",
    icon: Circle,
    bg: "bg-white border rounded-xl shadow",
  },
  {
    value: "in progress",
    label: "In Progress",
    icon: PauseCircle,
    bg: "bg-white border rounded-xl shadow",
  },
  {
    value: "done",
    label: "Done",
    icon: CheckCircle2,
    bg: "bg-white border rounded-xl shadow",
  },
  {
    value: "canceled",
    label: "Canceled",
    icon: XCircle,
    bg: "bg-white border rounded-xl shadow",
  },
  {
    value: "impeded",
    label: "Impeded",
    icon: AlertCircle,
    bg: "bg-white border rounded-xl shadow",
  },
];

export const priorities = [
  {
    label: "Low",
    value: "low",
    icon: ArrowDown,
  },
  {
    label: "Medium",
    value: "medium",
    icon: Circle,
  },
  {
    label: "High",
    value: "high",
    icon: ArrowUp,
  },
  {
    label: "Critical",
    value: "critical",
    icon: Flame,
  },
];

export const formStatuses = [
  {
    value: "backlog",
    label: "Backlog",
    icon: Clock,
    bg: "bg-white border rounded-xl",
  },
  {
    value: "todo",
    label: "To-do",
    icon: Circle,
    bg: "bg-white border rounded-xl",
  },
  {
    value: "in progress",
    label: "In Progress",
    icon: PauseCircle,
    bg: "bg-white border rounded-xl",
  },
  {
    value: "done",
    label: "Done",
    icon: CheckCircle2,
    bg: "bg-white border rounded-xl",
  },
  {
    value: "canceled",
    label: "Canceled",
    icon: XCircle,
    bg: "bg-white border rounded-xl",
  },
  {
    value: "impeded",
    label: "Impeded",
    icon: AlertCircle,
    bg: "bg-white border rounded-xl",
  },
];
