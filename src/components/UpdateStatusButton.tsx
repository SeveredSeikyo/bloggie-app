
"use client";

import { Button } from "@/components/ui/button";
import { useTransition } from "react";
import { Loader2, CheckCircle, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";

interface UpdateStatusButtonProps {
    id: string;
    status: 'draft' | 'posted';
    onPostStatusChanged: (id: string, newStatus: 'draft' | 'posted') => void;
}

export function UpdateStatusButton({ id, status, onPostStatusChanged }: UpdateStatusButtonProps) {
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();
    const { getAuthHeader } = useAuth();
    const newStatus = status === 'draft' ? 'posted' : 'draft';

    const handleClick = () => {
        startTransition(async () => {
            try {
                const formData = new FormData();
                formData.append('status', newStatus);

                const res = await fetch(`/api/blogs/${id}`, {
                    method: 'PATCH',
                    headers: getAuthHeader(),
                    body: formData,
                });

                if (!res.ok) {
                    throw new Error('Failed to update status');
                }
                
                onPostStatusChanged(id, newStatus);
                toast({
                    title: 'Success',
                    description: 'Post status updated.'
                });
            } catch (error) {
                toast({
                    title: 'Error',
                    description: 'Failed to update post status.',
                    variant: 'destructive'
                });
            }
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
