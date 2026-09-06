"use client";

import { useState, useTransition } from "react";
import type { BrandProduct } from "@/lib/products";
import { deleteProduct } from "./actions";
import { useToast } from "./toast";
import { ConfirmDeleteDialog } from "./confirm-delete-dialog";
import { ItemCard } from "./item-card";

interface ItemListClientProps {
  initialItems: BrandProduct[];
}

export function ItemListClient({ initialItems }: ItemListClientProps) {
  const [items, setItems] = useState(initialItems);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [, startTransition] = useTransition();
  const { showToast } = useToast();

  const pendingItem = items.find((item) => item.id === pendingDeleteId) ?? null;

  function confirmDelete() {
    if (pendingDeleteId === null) return;
    const id = pendingDeleteId;
    setPendingDeleteId(null);
    setDeletingId(id);
    startTransition(async () => {
      const result = await deleteProduct(id);
      setDeletingId(null);
      if (result.error) {
        showToast(result.error, "error");
      } else {
        setItems((prev) => prev.filter((item) => item.id !== id));
        showToast("Item deleted.", "success");
      }
    });
  }

  if (items.length === 0) {
    return <p className="py-12 text-center text-sm text-neutral-500">No items match these filters.</p>;
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {items.map((item) => (
          <ItemCard
            key={item.id}
            item={item}
            isDeleting={deletingId === item.id}
            onDelete={() => setPendingDeleteId(item.id)}
          />
        ))}
      </div>
      {pendingItem && (
        <ConfirmDeleteDialog
          itemName={pendingItem.name ?? "this item"}
          onCancel={() => setPendingDeleteId(null)}
          onConfirm={confirmDelete}
        />
      )}
    </>
  );
}
