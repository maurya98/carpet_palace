'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import { FiX, FiPlay } from 'react-icons/fi'

interface GalleryItem {
  id: string
  type: 'image' | 'video'
  src: string
  title: string
  description?: string
  width: number
  height: number
}

const baseGalleryItems: GalleryItem[] = [
  {
    id: '1',
    type: 'image',
    src: 'https://www.obeetee.in/cdn/shop/articles/Obeetee_carpets_-_Behind_the_Scenes.jpg',
    title: 'Master Artisan at Work',
    description: 'Our skilled craftsman hand-weaving a traditional Persian rug with precision and care',
    width: 400,
    height: 600
  },
  {
    id: '2',
    type: 'image',
    src: 'https://nazmiyalantiquerugs.com/wp-content/uploads/2021/08/vertical-area-rug-weaving-looms-nazmiyal.jpg',
    title: 'Traditional Weaving Technique',
    description: 'Preserving centuries-old techniques passed down through generations',
    width: 500,
    height: 400
  },
  {
    id: '3',
    type: 'image',
    src: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=2340&auto=format&fit=crop',
    title: 'Factory Floor Overview',
    description: 'Our state-of-the-art facility where quality meets tradition',
    width: 450,
    height: 550
  },
  {
    id: '4',
    type: 'image',
    src: 'https://www.nodusrug.it/wp-content/uploads/2022/04/What%20a%20hand-knotted%20luxury%20rug%20looks%20like.jpg',
    title: 'Hand-Knotting Process',
    description: 'Each knot is carefully placed by hand, ensuring durability and beauty',
    width: 400,
    height: 500
  },
  {
    id: '5',
    type: 'image',
    src: 'https://www.dalworthrugcleaning.com/images/rug-cleaning-process-area-rug-inspection.jpg',
    title: 'Quality Inspection',
    description: 'Rigorous quality control ensures every piece meets our high standards',
    width: 550,
    height: 450
  },
  {
    id: '6',
    type: 'image',
    src: 'https://www.obeetee.in/cdn/shop/articles/The_Process_of_Dyeing_Yarn_for_Carpets.jpg',
    title: 'Dyeing Process',
    description: 'Natural dyes are carefully prepared and applied to achieve vibrant colors',
    width: 400,
    height: 600
  },
  {
    id: '7',
    type: 'image',
    src: 'https://images.unsplash.com/photo-1731167710941-e4d533f9e2aa?q=80&w=1439&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: 'Design Planning',
    description: 'Master designers create intricate patterns that tell stories',
    width: 500,
    height: 400
  },
  {
    id: '8',
    type: 'image',
    src: 'https://images.unsplash.com/photo-1600166898405-da9535204843?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: 'Finishing Touches',
    description: 'Final steps in creating a masterpiece that will last for generations',
    width: 450,
    height: 550
  },
  {
    id: '9',
    type: 'image',
    src: 'https://cdn.shopify.com/s/files/1/0587/0741/1096/files/The_Social_and_Economic_Impact_of_Handmade_Carpets_1024x1024.jpg',
    title: 'Team Collaboration',
    description: 'Our dedicated team working together to bring artistry to life',
    width: 400,
    height: 500
  },
  {
    id: '10',
    type: 'image',
    src: 'https://plus.unsplash.com/premium_photo-1725456679380-84fa1395d209?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: 'Traditional Patterns',
    description: 'Ancient patterns recreated with modern precision',
    width: 550,
    height: 450
  },
  {
    id: '11',
    type: 'image',
    src: 'https://cdn.shopify.com/s/files/1/0587/0741/1096/files/different_rug_materials_for_Home_1024x1024.jpg?v=1669886085',
    title: 'Material Selection',
    description: 'Only the finest materials are chosen for our carpets',
    width: 400,
    height: 600
  },
  {
    id: '12',
    type: 'image',
    src: 'https://kohantextilejournal.com/wp-content/uploads/2022/06/zimmer2.png',
    title: 'Production Line',
    description: 'Efficient production while maintaining traditional quality',
    width: 500,
    height: 400
  },
]

export default function GalleryPage() {
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null)

  // Split items into six columns and duplicate for seamless loop
  const columns = useMemo(() => {
    const items = [...baseGalleryItems]
    const itemsPerColumn = Math.ceil(items.length / 6)
    
    // Split items into 6 columns
    const cols = Array.from({ length: 6 }, (_, i) => {
      const start = i * itemsPerColumn
      const end = start + itemsPerColumn
      return items.slice(start, end)
    })
    
    // Duplicate items for seamless scrolling and assign scroll direction
    return cols.map((col, index) => ({
      items: [...col, ...col, ...col],
      direction: index % 2 === 0 ? 'up' : 'down' // Alternate directions
    }))
  }, [])

  // Flat list of all items for mobile static grid
  const allItems = useMemo(() => baseGalleryItems, [])

  return (
    <>
      <style>{`
        @keyframes scrollUp {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(-33.333%);
          }
        }
        
        @keyframes scrollDown {
          0% {
            transform: translateY(-33.333%);
          }
          100% {
            transform: translateY(0);
          }
        }
        
        .scroll-up {
          animation: scrollUp 30s linear infinite;
        }
        
        .scroll-down {
          animation: scrollDown 30s linear infinite;
        }
        
        .scroll-up:hover,
        .scroll-down:hover {
          animation-play-state: paused;
        }
        
        /* Disable animations on mobile */
        @media (max-width: 767px) {
          .scroll-up,
          .scroll-down {
            animation: none;
            transform: none !important;
          }
        }
      `}</style>
      <div className="min-h-screen flex flex-col">
        <div className="container mx-auto px-4 flex-1 flex flex-col pb-12">
          {/* Hero Section */}
          <div className="text-center mb-12 pt-12">
            <h1 className="section-title">Our Gallery</h1>
            <p className="section-subtitle max-w-3xl mx-auto">
              Discover the artistry, dedication, and meticulous craftsmanship behind every Carpet Palace creation
            </p>
          </div>

          {/* Mobile: Static Grid View */}
          <div className="md:hidden pb-8">
            <div className="grid grid-cols-2 gap-4">
              {allItems.map((item) => {
                return (
                  <div
                    key={item.id}
                    className="group cursor-pointer mb-4"
                    onClick={() => setSelectedItem(item)}
                  >
                    <div className="relative overflow-hidden rounded-lg shadow-md w-full">
                      <div className="relative w-full" style={{ aspectRatio: `${item.width} / ${item.height}` }}>
                        <Image
                          src={item.src}
                          alt={item.title}
                          width={item.width}
                          height={item.height}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          sizes="50vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                        <div className="absolute bottom-0 left-0 right-0 p-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                          <h3 className="text-white font-semibold text-sm mb-1">{item.title}</h3>
                          {item.description && (
                            <p className="text-white/90 text-xs line-clamp-2">{item.description}</p>
                          )}
                        </div>
                        {item.type === 'video' && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <FiPlay className="w-5 h-5 text-royal-800 ml-1" />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Desktop: Six Column Continuous Scrolling Gallery - Centered */}
          <div className="hidden md:flex justify-center flex-1 pb-8">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 md:gap-6 overflow-hidden w-full max-w-full">
              {columns.map((column, colIndex) => (
                <div key={colIndex} className="overflow-hidden relative">
                  {/* Top fade-out gradient - images disappear as they scroll up */}
                  <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-royal-50 via-royal-50/80 to-transparent z-10 pointer-events-none" />
                  {/* Bottom fade-out gradient - images disappear as they scroll down */}
                  <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-royal-50 via-royal-50/80 to-transparent z-10 pointer-events-none" />
                  <div className={column.direction === 'up' ? 'scroll-up' : 'scroll-down'}>
                    {column.items.map((item, index) => {
                      const aspectRatio = item.height / item.width
                      const baseHeight = 300
                      const calculatedHeight = baseHeight * aspectRatio
                      
                      return (
                        <div
                          key={`col-${colIndex}-${item.id}-${index}`}
                          className="mb-4 group cursor-pointer"
                          onClick={() => setSelectedItem(item)}
                        >
                          <div className="relative overflow-hidden rounded-lg">
                            <div 
                              className="relative w-full overflow-hidden"
                              style={{ height: `${calculatedHeight}px` }}
                            >
                              <Image
                                src={item.src}
                                alt={item.title}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                sizes="(max-width: 1024px) 50vw, (max-width: 1280px) 33vw, (max-width: 1536px) 25vw, (max-width: 1920px) 20vw, 16.666vw"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                              <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                <h3 className="text-white font-semibold text-base mb-1">{item.title}</h3>
                                {item.description && (
                                  <p className="text-white/90 text-xs line-clamp-2">{item.description}</p>
                                )}
                              </div>
                              {item.type === 'video' && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <FiPlay className="w-6 h-6 text-royal-800 ml-1" />
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Lightbox Modal */}
        {selectedItem && (
          <div
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
            onClick={() => setSelectedItem(null)}
          >
            <div className="relative max-w-6xl w-full max-h-[90vh]">
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
                aria-label="Close"
              >
                <FiX className="w-6 h-6" />
              </button>
              
              <div
                className="bg-white rounded-lg overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                {selectedItem.type === 'image' ? (
                  <div className="relative w-full" style={{ height: '70vh' }}>
                    <Image
                      src={selectedItem.src}
                      alt={selectedItem.title}
                      fill
                      className="object-contain"
                    />
                  </div>
                ) : (
                  <div className="relative w-full aspect-video bg-black">
                    <video
                      src={selectedItem.src}
                      controls
                      autoPlay
                      className="w-full h-full"
                    />
                  </div>
                )}
                
                <div className="p-6">
                  <h2 className="text-2xl font-serif font-bold text-royal-900 mb-2">
                    {selectedItem.title}
                  </h2>
                  {selectedItem.description && (
                    <p className="text-royal-700">{selectedItem.description}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
