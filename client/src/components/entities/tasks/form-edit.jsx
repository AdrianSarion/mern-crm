import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { taskSchema } from "@/data/tasks";

import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CalendarIcon, Plus, Trash2 } from "lucide-react";
import {
  Avatar,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import Tiptap from "@/components/entities/tasks/form-tiptap-editor";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  useDeleteTaskMutation,
  useEditTaskMutation,
} from "@/features/api/tasks";
import { Spinner } from "@/components/ui/spinner";
import { useState } from "react";
import { cn, formatter } from "@/lib/utils";
import { SelectLabel, SelectPriority, SelectStatus } from "./form-select";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { Calendar } from "@/components/ui/calendar";
import { format, formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { toggleTaskDrawer } from "@/features/tasks/slice";
import { useUploadThing } from "@/lib/uploadthing";
import { Label } from "@/components/ui/label";
import { fileTypeIcons } from "@/data/file-types";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu";
import { assignees } from "@/data/deals";
import { focusDealById } from "@/features/deals/slice";

export function TaskForm({ task }) {
  // some state
  const [open, setOpen] = useState(false);
  
  // react-hook-form
  const form = useForm({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      attachements: task.attachements,
      title: task.title,
      description: task.description,
    },
    mode: "onSubmit",
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "attachements",
  });

  // Redux, Did we really need to use it?
  const dispatch = useDispatch();
  const [editTask, { isLoading }] = useEditTaskMutation();
  const [deleteTask, { isLoading: pendingDelete }] = useDeleteTaskMutation();

  // That thing for uploads
  const { startUpload, isUploading } = useUploadThing("multiUploader", {
    skipPolling: true,
    onClientUploadComplete: (res) => {
      append(
        { name: res[0].name, size: res[0].size, type: res[0].type, url: res[0].url },
        { shouldValidate: true },
      );
    },
    onUploadError: (error) => {
      console.error(error);
      toast.error("Error occurred while uploading");
    },
    onUploadBegin: () => {
      // May need it later.
      // alert("upload has begun");
    },
  });

  // Handlers
  const handleClickDelete = async () => {
    if (!pendingDelete) {
      try {
        await deleteTask(task._id).unwrap();
        dispatch(toggleTaskDrawer());
        dispatch(focusDealById(null));
        toast.success(`Task ${task.id} deletion was successful.`);
      } catch (err) {
        console.error(err);
        toast.error(`Failed deleting task.`);
      }
    }
  };

  async function onSubmit(data) {
    try {
      await editTask({ id: task._id, data }).unwrap();
      dispatch(toggleTaskDrawer());
    } catch (err) {
      console.error(err);
      toast.error("Failed Task Update..");
    }
  }

  return (
    <div className="bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 min-h-screen flex items-center justify-center">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mx-auto w-max h-max flex flex-col justify-center">
          <Card className="border border-gray-800 bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 shadow-2xl min-h-[80vh] flex flex-col">
            <CardHeader>
              {/* Header */}
              <div className="flex justify-between">
                <span className="text-xs text-gray-400">{task.id?.toUpperCase()}</span>
                <span className="text-xs text-gray-400">
                  {task.dueDate ? "DUE-DATE" : null}
                </span>
              </div>
              {/* Title */}
              <div className="flex justify-between">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem className="grow">
                      <FormControl>
                        <Input
                          id="title"
                          className="border-none text-xl font-bold focus-visible:ring-0 shadow-none py-0 pl-0 placeholder:text-gray-400 bg-gray-800/50 text-white"
                          placeholder={
                            task.title ?? "Title: ex. Sell kidney to buy Porshe."
                          }
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <span className="text-s font-medium shrink-0 text-gray-300">
                  {task.dueDate ? formatter.format(new Date(task.dueDate)) : null}
                </span>
              </div>
              {/* User, Created Time */}
              <span className="text-xs text-gray-400">
                Added by <span className="underline text-blue-400">{`${task.owner?.firstName ?? "Unknown"} ${task.owner?.lastName ?? "User"}`}</span>,{" "}
                {formatDistanceToNow(task.createdAt)} ago.
              </span>
            </CardHeader>
            <Separator className="bg-gray-700/50" />
            <CardContent className="py-0 mb-0 grow">
              <div className="flex flex-wrap flex-col gap-3 py-6">
                {/* Assignee */}
                <div className="flex items-center gap-1">
                  <span className="text-s font-medium w-28 text-gray-400">Assignee</span>
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <div className="flex justify-center align-middle">
                        <Button
                          className="border-none shadow-none h-7 p-0 ml-[3px] bg-gray-800/50 text-gray-200"
                          type="button"
                          variant="outline">
                          <img
                            className="w-5 h-5 rounded-xl"
                            src={
                              form.getValues("assignee")?.avatar ||
                              task.assignee?.avatar ||
                              Avatar
                            }
                            alt="user's avatar"
                          />
                          <span className="mx-2">
                            {form.getValues("assignee")?.name ||
                              task.assignee?.name ||
                              "No one."}
                          </span>
                        </Button>
                        <CaretSortIcon className="h-4 w-4 opacity-50 self-center text-gray-400" />
                      </div>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0 bg-gray-900 border-gray-700 text-gray-200" align="start">
                      <Command>
                        <CommandInput placeholder="Select..." className="bg-gray-800 text-gray-200" />
                        <CommandList>
                          <CommandEmpty>No results found.</CommandEmpty>
                          <CommandGroup>
                            {assignees.map((ass) => {
                              return (
                                <CommandItem
                                  key={crypto.randomUUID()}
                                  value={ass.name}
                                  {...form.register}
                                  onSelect={(value) => {
                                    const assignee = assignees.find(
                                      (ass) => ass.name === value,
                                    );
                                    if (assignee) form.setValue("assignee", assignee);
                                    setOpen(false);
                                  }}>
                                  <img
                                    alt="user's avatar"
                                    src={ass.avatar ?? Avatar}
                                    className="mr-2 h-4 w-4 rounded-xl"
                                  />
                                  <span>{ass.name}</span>
                                </CommandItem>
                              );
                            })}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
                {/* Status */}
                <div className="flex items-center gap-1">
                  <span className="text-s font-medium text-gray-400 w-28">Status</span>
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <SelectStatus task={task} field={field} darkMode />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                {/* Priority */}
                <div className="flex items-center gap-1">
                  <span className="text-s font-medium text-gray-400 w-28">Priority</span>
                  <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <SelectPriority task={task} field={field} darkMode />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                {/* Label */}
                <div className="flex items-center gap-1">
                  <span className="text-s font-medium text-gray-400 w-28">Label</span>
                  <FormField
                    control={form.control}
                    name="label"
                    render={({ field }) => (
                      <FormItem className="flex gap-4">
                        <FormControl>
                          <SelectLabel task={task} field={field} darkMode />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                {/* Due Date */}
                <div className="flex items-center gap-1">
                  <span className="text-s font-medium text-gray-400 w-28">Due Date</span>
                  <FormField
                    control={form.control}
                    name="dueDate"
                    render={({ field }) => (
                      <FormItem className="flex gap-4">
                        <FormControl>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant={"outline"}
                                type="button"
                                className={cn(
                                  "w-max justify-start p-0 shadow-none text-left font-normal border-none bg-gray-800/50 text-gray-200",
                                  !task.dueDate && "text-muted-foreground",
                                )}>
                                <CalendarIcon className="mr-2 h-4 w-4 text-gray-400" />
                                {field.value
                                  ? format(field.value, "PPP")
                                  : task.dueDate
                                  ? format(task.dueDate, "PPP")
                                  : "Pick a date"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 bg-gray-900 border-gray-700 text-gray-200">
                              <Calendar
                                mode="single"
                                selected={new Date(task.dueDate) || field.value}
                                onSelect={field.onChange}
                                disabled={{ before: new Date() }}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              {/* Description */}
              <div className="py-0">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold text-gray-400">
                        DESCRIPTION
                      </FormLabel>
                      <FormControl>
                        <ScrollArea className="bg-gray-800/50 rounded-md border border-gray-700">
                          <div className="p-3 rounded-lg">
                            <Tiptap
                              data-vaul-no-drag
                              styles = "border-none rounded-lg min-h-20 max-h-60 w-[620px] shadow-none py-0 pl-0 break-words text-s text-gray-200"
                              description={field.value}
                              onChange={field.onChange}
                            />
                          </div>
                        </ScrollArea>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/* Attachements */}
              <div className="pt-2">
                <div className="flex items-center gap-2 mt-2">
                <Label className="text-xs font-semibold text-gray-400">ATTACHEMENTS</Label>
                  <p className="text-xs text-gray-500">
                    Up to 3 attachements (image, text, pdf, docx..)
                  </p>
                </div>
                <section className="flex gap-2 items-center mt-3 flex-wrap whitespace-normal">
                  {fields.map((field, index) => (
                    <FormField
                      control={form.control}
                      key={field.id}
                      name={`attachements.${index}`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                          <ContextMenu>
                           <ContextMenuTrigger>
                            <Button
                              variant="outline"
                              type="button"
                              id={`attachements-button-${index}`}
                              className="pl-1 pr-3 h-12 flex gap-2 bg-gray-800/50 border-gray-700 text-gray-200"
                              onClick={() => {
                                const url = field.value.url;
                                window.open(url, '_blank', 'noopener,noreferrer');
                              }}>
                              <img src={fileTypeIcons.find((e) => e.mime === field.value.type).icon} alt="FileTypeIcon" />
                              <div className="flex flex-col text-left">
                                <span className="text-xs">{field.value.name}</span>
                                <span className="text-xs text-gray-400">{fileTypeIcons.find((e) => e.mime === field.value.type).name} &bull; Download</span>
                              </div>
                            </Button>
                              </ContextMenuTrigger>
                          <ContextMenuContent>
                            <ContextMenuItem className="text-[0.8rem] text-justify" onSelect={() => document.getElementById(`attachements-button-${index}`).click()}>View in a new tab</ContextMenuItem>
                            <ContextMenuItem disabled className="text-[0.8rem] text-justify">Replace</ContextMenuItem>
                            <Separator />
                            <ContextMenuItem className="text-[0.8rem] text-red-500 text-justify" onSelect={() => remove(index)}>Delete</ContextMenuItem>
                           </ContextMenuContent>
                              </ContextMenu>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}
                  <Input
                    hidden
                    type="file"
                    id="attachements"
                    onChange={(event) => {
                      startUpload([event.target.files[0]]);
                    }}
                  />
                  <Button
                    variant="outline"
                    type="button"
                    className="h-12 w-12 bg-gray-800/50 border-gray-700 text-gray-200"
                    onClick={() => {
                      // Imma do the forbidden, ,- ,
                      document.getElementById("attachements").click();
                    }}>
                    {isUploading ? <Spinner size="12" /> : <Plus size="16" className="text-gray-200" />}
                  </Button>
                </section>
              </div>
            </CardContent>
            <CardFooter className="justify-end self-end p-3 gap-2 mt-auto">
              <FormMessage />
              <Button
                type="button"
                disabled={isLoading}
                variant="ghost"
                onClick={() => handleClickDelete()}
                className="text-red-400 w-max flex justify-center align-end hover:bg-red-900/20">
                {isLoading ? <Spinner size="small" /> : <Trash2 size="18" className="text-red-400" />} {" "}
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="text-slate-200 w-max flex justify-center align-end hover:bg-lime-700/40 bg-gray-800/70 border-gray-700">
                {isLoading ? <Spinner size="small" /> : "Update"} {" "}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
}
