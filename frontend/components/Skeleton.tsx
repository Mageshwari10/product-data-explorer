export function Skeleton({ className }: { className?: string }) {
    return (
        <div className={`animate-pulse bg-emerald-100/30 rounded-2xl ${className}`}></div>
    );
}

export function ProductSkeleton() {
    return (
        <div className="glass p-6 rounded-[32px] border-white/40 bg-white/20">
            <Skeleton className="h-48 w-full mb-4" />
            <Skeleton className="h-4 w-3/4 mb-2" />
            <Skeleton className="h-3 w-1/2 mb-4" />
            <Skeleton className="h-8 w-1/3" />
        </div>
    );
}

export function CategorySkeleton() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
                <ProductSkeleton key={i} />
            ))}
        </div>
    );
}
