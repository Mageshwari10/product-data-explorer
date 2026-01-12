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
                <div className="relative h-48 sm:h-56 md:h-64 lg:h-72 w-full bg-slate-50/30 p-3 sm:p-4 md:p-6 lg:p-8">
                    {/* Source ID Badge */}
                    {product.sourceId && (
                        <div className="absolute top-2 sm:top-3 md:top-4 left-2 sm:left-3 md:left-4 z-10 bg-slate-900/10 backdrop-blur-md px-2 py-1 rounded-lg text-[7px] sm:text-[8px] font-black text-slate-500 uppercase tracking-widest border border-white/20">
                            ID: {product.sourceId}
                        </div>
                    )}
                    
                    {/* Rating Badge */}
                    {product.rating && (
                        <div className="absolute top-2 sm:top-3 md:top-4 right-2 sm:right-3 md:right-4 z-10 bg-emerald-600/90 backdrop-blur-md px-2 py-1 rounded-lg text-[7px] sm:text-[8px] font-black text-white uppercase tracking-widest flex items-center gap-1">
                            ⭐ {product.rating}
                            {product.reviewCount && <span className="text-[6px] sm:text-[7px]">({product.reviewCount})</span>}
                        </div>
                    )}
                    
                    {/* Product Image */}
                    {product.imageUrl ? (
                        <Image
                            src={product.imageUrl}
                            alt={product.title}
                            fill
                            className="object-contain p-2 sm:p-3 md:p-4 group-hover:scale-110 transition-transform duration-700"
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full text-slate-300 font-black uppercase text-[7px] sm:text-[8px] tracking-[0.2em]">Archival Record</div>
                    )}
                </div>
                
                <div className="p-3 sm:p-4 md:p-6">
                    {/* Title and Author */}
                    <div className="min-h-[2.5rem] sm:min-h-[3rem] md:min-h-[4rem]">
                        <h3 className="font-outfit text-xs sm:text-sm md:text-base lg:text-lg font-black text-slate-900 line-clamp-2 leading-tight group-hover:text-emerald-600 transition-colors uppercase tracking-tight">
                            {product.title}
                        </h3>
                        {product.author && (
                            <p className="text-[7px] sm:text-[8px] md:text-[9px] lg:text-[10px] font-black italic text-emerald-600 uppercase tracking-widest mt-1">by {product.author}</p>
                        )}
                        
                        {/* Publisher and Date */}
                        {(product.publisher || product.publicationDate) && (
                            <div className="mt-2 text-[6px] sm:text-[7px] md:text-[8px] text-slate-500 uppercase tracking-widest">
                                {product.publisher && <span className="font-medium">{product.publisher}</span>}
                                {product.publisher && product.publicationDate && <span className="mx-1">•</span>}
                                {product.publicationDate && <span>{new Date(product.publicationDate).getFullYear()}</span>}
                            </div>
                        )}
                        
                        {/* ISBN */}
                        {product.isbn && (
                            <div className="mt-1 text-[6px] sm:text-[7px] md:text-[8px] text-slate-400 font-mono">
                                ISBN: {product.isbn}
                            </div>
                        )}
                    </div>
                    
                    {/* Price and Action */}
                    <div className="mt-3 sm:mt-4 md:mt-6 flex items-center justify-between">
                        <div>
                            <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-black gradient-text">
                                <span className="text-[7px] sm:text-[8px] md:text-[9px] lg:text-[10px] font-black text-slate-400 mr-1 uppercase">{product.currency || 'USD'}</span>
                                {product.price}
                            </p>
                            {product.category && (
                                <p className="text-[6px] sm:text-[7px] md:text-[8px] text-slate-500 uppercase tracking-widest mt-1">{product.category}</p>
                            )}
                        </div>
                        <div className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 bg-emerald-50 group-hover:bg-emerald-600 group-hover:text-white rounded-xl sm:rounded-2xl flex items-center justify-center transition-all shadow-sm">
                            <span className="text-sm sm:text-base md:text-lg">⚡</span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
