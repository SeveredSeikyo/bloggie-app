"use client";

import { Button } from "@/components/ui/button";
import { updatePostStatusAction } from "@/lib/actions";
import { useTransition } from "react";
import { Loader2, CheckCircle, Edit } from "lucide-react";

export function UpdateStatusButton({ id, status }: { id: string, status: 'draft' | 'posted' }) {
    const [isPending, startTransition] = useTransition();
    const newStatus = status === 'draft' ? 'posted' : 'draft';

    const handleClick = () => {
        startTransition(async () => {
            await updatePostStatusAction(id, newStatus);
        });
    };

    return (
        <Button
            onClick={handleClick}
            disabled={isPending}
            variant="outline"
            size="sm"
        >
            {isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : newStatus === 'posted' ? (
                <CheckCircle className="mr-2 h-4 w-4" />
            ) : (
                <Edit className="mr-2 h-4 w-4" />
            )}
            {isPending ? 'Updating...' : `Mark as ${newStatus}`}
        </Button>
    );
}
