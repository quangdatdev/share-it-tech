"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Subbredit = {
  id: string;
  name: string;
  creatorId: string;
  createdAt: Date;
  postCount: number;
  member: number;
};

export const columns: ColumnDef<Subbredit>[] = [
  {
    accessorKey: "name",
    header: "Community Name",
  },
  {
    accessorKey: "creatorId",
    header: "Author",
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      const formarted = date.toLocaleDateString();
      return <div className="">{formarted}</div>;
    },
  },
  {
    accessorKey: "member",
    header: "Membership",
  },
  {
    accessorKey: "postCount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Total Post
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const subreddit = row.original;

      const handleDelete = async (subredditId: string) => {
        try {
          // Gọi API xóa Subreddit
          const response = await fetch(`/api/subreddit/delete`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              // Các headers khác nếu cần
            },
            body: JSON.stringify({
              subredditId: String(subredditId),
            }),
          });

          if (response.ok) {
            // Xóa thành công, có thể thực hiện các hành động cần thiết
            console.log("Subreddit deleted successfully");
          } else {
            // Xử lý lỗi nếu cần
            console.error("Failed to delete Subreddit");
          }
        } catch (error) {
          // Xử lý lỗi nếu có lỗi trong quá trình gọi API
          console.error("Error calling delete API:", error);
        }
      };

      const handleDeleteClick: React.MouseEventHandler<HTMLDivElement> = async (
        event
      ) => {
        event.stopPropagation(); // Ngăn chặn sự kiện lan rộng đến các thành phần cha

        // Gọi hàm handleDelete khi nút được nhấn
        await handleDelete(subreddit.id);
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={handleDeleteClick}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
