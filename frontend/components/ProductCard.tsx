import Image from 'next/image';
import Link from 'next/link';

interface Product {
    id: number;
    title: string;
    price: string | number;
    imageUrl?: string;
    currency?: string;
    author?: string;
    sourceId?: string;
    isbn?: string;
    publisher?: string;
    publicationDate?: string;
    rating?: number;
    reviewCount?: number;
    category?: string;
}

export default function ProductCard({ product }: { product: Product }) {
    return (
        <Link href={`/product/${product.id}`} className="group relative">
            <div className="card-shine bg-white rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-emerald-50 hover:-translate-y-2">
                <div className="relative h-56 sm:h-64 md:h-72 w-full bg-slate-50/30 p-4 sm:p-6 md:p-8">
                    {/* Source ID Badge */}
                    {product.sourceId && (
                        <div className="absolute top-4 left-4 z-10 bg-slate-900/10 backdrop-blur-md px-2 py-1 rounded-lg text-[8px] font-black text-slate-500 uppercase tracking-widest border border-white/20">
                            ID: {product.sourceId}
                        </div>
                    )}
                    
                    {/* Rating Badge */}
                    {product.rating && (
                        <div className="absolute top-4 right-4 z-10 bg-emerald-600/90 backdrop-blur-md px-2 py-1 rounded-lg text-[8px] font-black text-white uppercase tracking-widest flex items-center gap-1">
                            ⭐ {product.rating}
                            {product.reviewCount && <span className="text-[7px]">({product.reviewCount})</span>}
                        </div>
                    )}
                    
                    {/* Product Image */}
                    {product.imageUrl ? (
                        <Image
                            src={product.imageUrl}
                            alt={product.title}
                            fill
                            className="object-contain p-4 group-hover:scale-110 transition-transform duration-700"
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full text-slate-300 font-black uppercase text-[8px] tracking-[0.2em]">Archival Record</div>
                    )}
                </div>
                
                <div className="p-4 sm:p-6">
                    {/* Title and Author */}
                    <div className="min-h-[3rem] sm:min-h-[4rem]">
                        <h3 className="font-outfit text-sm sm:text-base font-black text-slate-900 line-clamp-2 leading-tight group-hover:text-emerald-600 transition-colors uppercase tracking-tight">
                            {product.title}
                        </h3>
                        {product.author && (
                            <p className="text-[8px] sm:text-[10px] font-black italic text-emerald-600 uppercase tracking-widest mt-1">by {product.author}</p>
                        )}
                        
                        {/* Publisher and Date */}
                        {(product.publisher || product.publicationDate) && (
                            <div className="mt-2 text-[7px] sm:text-[8px] text-slate-500 uppercase tracking-widest">
                                {product.publisher && <span className="font-medium">{product.publisher}</span>}
                                {product.publisher && product.publicationDate && <span className="mx-1">•</span>}
                                {product.publicationDate && <span>{new Date(product.publicationDate).getFullYear()}</span>}
                            </div>
                        )}
                        
                        {/* ISBN */}
                        {product.isbn && (
                            <div className="mt-1 text-[7px] sm:text-[8px] text-slate-400 font-mono">
                                ISBN: {product.isbn}
                            </div>
                        )}
                    </div>
                    
                    {/* Price and Action */}
                    <div className="mt-4 sm:mt-6 flex items-center justify-between">
                        <div>
                            <p className="text-lg sm:text-2xl font-black gradient-text">
                                <span className="text-[8px] sm:text-[10px] font-black text-slate-400 mr-1 uppercase">{product.currency || 'USD'}</span>
                                {product.price}
                            </p>
                            {product.category && (
                                <p className="text-[7px] sm:text-[8px] text-slate-500 uppercase tracking-widest mt-1">{product.category}</p>
                            )}
                        </div>
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-emerald-50 group-hover:bg-emerald-600 group-hover:text-white rounded-xl sm:rounded-2xl flex items-center justify-center transition-all shadow-sm">
                            <span className="text-lg sm:text-xl">⚡</span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
