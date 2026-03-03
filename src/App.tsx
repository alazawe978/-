import React, { useState, useEffect, useRef } from 'react';
import { Plus, Gavel, ShoppingCart, MessageCircle, X, Image as ImageIcon, Loader2, ArrowRight, Globe, DollarSign, Coins, ChevronLeft, ChevronRight, Trash2, LogIn, LogOut, Settings, ShieldCheck, LayoutDashboard, Edit3, Save, Search, Filter, Ship, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Item, ItemWithBids } from './types';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const translations = {
  ar: {
    title: "عالم الباخره",
    sellItem: "إضافة قطعة جديدة",
    loading: "جاري تحميل المزاد...",
    noItems: "لا توجد قطع معروضة حالياً",
    beFirst: "كن أول من يعرض قطعة في مزاد عالم الباخره!",
    listNow: "إضافة قطعة",
    currentBid: "المزايدة الحالية",
    startingPrice: "سعر البداية",
    sold: "تم البيع",
    active: "نشط",
    placeBid: "تقديم مزايدة",
    yourName: "اسم المزايد",
    bidAmount: "مبلغ المزايدة",
    buyNow: "اشتري الآن",
    contactSeller: "تواصل مع البائع (واتساب)",
    bidHistory: "سجل المزايدات",
    noBids: "لا توجد مزايدات بعد",
    listItem: "عرض قطعة جديدة في المزاد",
    itemTitle: "اسم القطعة",
    whatSelling: "ما هي القطعة التي تود عرضها؟",
    description: "وصف القطعة",
    describeItem: "اكتب وصفاً تفصيلياً للقطعة...",
    whatsapp: "رقم الواتساب للتواصل",
    sellerNotes: "ملاحظات البائع (سرية)",
    uploadImages: "ارفع صور القطعة (حتى 5 صور)",
    imageLimit: "JPG, PNG أو WEBP",
    adminLogin: "دخول الإدارة",
    adminDashboard: "لوحة التحكم",
    username: "اسم المستخدم",
    password: "كلمة المرور",
    login: "دخول",
    logout: "خروج",
    deleteItem: "حذف القطعة",
    editItem: "تعديل القطعة",
    saveChanges: "حفظ التغييرات",
    confirmDelete: "هل أنت متأكد من حذف هذه القطعة؟",
    success: "تمت العملية بنجاح",
    errorBid: "يجب أن تكون المزايدة أعلى من السعر الحالي",
    errorName: "يرجى إدخال اسمك للمزايدة",
    errorImages: "يرجى رفع صورة واحدة على الأقل",
    errorLogin: "اسم المستخدم أو كلمة المرور غير صحيحة",
    iqd: "د.ع",
    searchPlaceholder: "ابحث عن قطعة...",
    filterAll: "الكل",
    filterActive: "المتوفر",
    filterSold: "المباع",
    totalItems: "إجمالي القطع",
    activeItems: "القطع النشطة",
    soldItems: "القطع المباعة",
    totalBids: "إجمالي المزايدات",
    actions: "الإجراءات",
    backToPublic: "العودة للمتجر",
    lightMode: "الوضع الفاتح",
    darkMode: "الوضع الليلي",
    managePosts: "إدارة المنشورات",
    cancel: "إلغاء",
    confirm: "تأكيد",
  }
};

const AdminDashboard = ({ 
  items, 
  t, 
  onEdit, 
  onDelete, 
  onViewDetails 
}: { 
  items: Item[], 
  t: any, 
  onEdit: (item: Item) => void, 
  onDelete: (id: number) => void,
  onViewDetails: (id: number) => void
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  
  const stats = {
    total: items.length,
    active: items.filter(i => i.status === 'active').length,
    sold: items.filter(i => i.status === 'sold').length,
    totalBids: items.reduce((acc, i) => acc + (i.current_bid > 0 ? 1 : 0), 0) // Simplified bid count
  };

  const totalPages = Math.ceil(items.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = items.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: t.totalItems, value: stats.total, icon: LayoutDashboard, color: "zinc" },
          { label: t.activeItems, value: stats.active, icon: Globe, color: "emerald" },
          { label: t.soldItems, value: stats.sold, icon: ShoppingCart, color: "amber" },
          { label: t.totalBids, value: stats.totalBids, icon: Gavel, color: "indigo" }
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 shadow-sm hover:shadow-xl transition-all group">
            <div className={cn(
              "w-12 h-12 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform",
              stat.color === "zinc" && "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900",
              stat.color === "emerald" && "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400",
              stat.color === "amber" && "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400",
              stat.color === "indigo" && "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400"
            )}>
              <stat.icon className="w-6 h-6" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500 mb-1">{stat.label}</p>
            <p className="text-4xl font-black text-zinc-900 dark:text-zinc-100">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Items Table */}
      <div className="bg-white dark:bg-zinc-900 rounded-[3rem] border border-zinc-100 dark:border-zinc-800 shadow-sm overflow-hidden">
        <div className="p-10 border-b border-zinc-50 dark:border-zinc-800 flex items-center justify-between">
          <h2 className="text-2xl font-black text-zinc-900 dark:text-zinc-100">{t.managePosts}</h2>
          <div className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
            عرض {startIndex + 1}-{Math.min(startIndex + itemsPerPage, items.length)} من {items.length}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="bg-zinc-50/50 dark:bg-zinc-800/50">
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">{t.itemTitle}</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">{t.startingPrice}</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">{t.currentBid}</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">الحالة</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">{t.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800">
              {currentItems.map((item) => (
                <tr key={item.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/50 transition-colors group">
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 flex-shrink-0">
                        {item.images && item.images[0] ? (
                          <img src={item.images[0]} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-zinc-300 dark:text-zinc-700">
                            <ImageIcon className="w-6 h-6" />
                          </div>
                        )}
                      </div>
                      <div className="max-w-[200px]">
                        <p className="font-black text-zinc-900 dark:text-zinc-100 truncate">{item.title}</p>
                        <p className="text-xs text-zinc-400 dark:text-zinc-500 truncate">{item.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-8 font-black text-zinc-900 dark:text-zinc-100">
                    {item.starting_price.toLocaleString()} {t.iqd}
                  </td>
                  <td className="px-10 py-8 font-black text-emerald-600 dark:text-emerald-400">
                    {item.current_bid > 0 ? `${item.current_bid.toLocaleString()} ${t.iqd}` : '-'}
                  </td>
                  <td className="px-10 py-8">
                    <span className={cn(
                      "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest",
                      item.status === 'active' ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500"
                    )}>
                      {item.status === 'active' ? t.active : t.sold}
                    </span>
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => onViewDetails(item.id)}
                        className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center hover:bg-zinc-900 dark:hover:bg-zinc-100 hover:text-white dark:hover:text-zinc-900 transition-all"
                        title="عرض"
                      >
                        <ArrowRight className="w-4 h-4 rotate-180" />
                      </button>
                      <button 
                        onClick={() => onEdit(item)}
                        className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center hover:bg-zinc-900 dark:hover:bg-zinc-100 hover:text-white dark:hover:text-zinc-900 transition-all"
                        title={t.editItem}
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => onDelete(item.id)}
                        className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400 transition-all"
                        title={t.deleteItem}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="p-8 bg-zinc-50/50 dark:bg-zinc-800/50 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-center gap-4">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="w-12 h-12 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:border-zinc-900 dark:hover:border-zinc-100 transition-all shadow-sm"
            >
              <ChevronRight className="w-5 h-5 dark:text-zinc-400" />
            </button>
            
            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={cn(
                    "w-12 h-12 rounded-2xl font-black text-sm transition-all",
                    currentPage === page 
                      ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-xl shadow-zinc-200 dark:shadow-none" 
                      : "bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 text-zinc-400 hover:border-zinc-900 dark:hover:border-zinc-100 hover:text-zinc-900 dark:hover:text-zinc-100"
                  )}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="w-12 h-12 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:border-zinc-900 dark:hover:border-zinc-100 transition-all shadow-sm"
            >
              <ChevronLeft className="w-5 h-5 dark:text-zinc-400" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const DeleteConfirmModal = ({ 
  t, 
  onConfirm, 
  onCancel 
}: { 
  t: any, 
  onConfirm: () => void, 
  onCancel: () => void 
}) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onCancel}
        className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative bg-white dark:bg-zinc-900 rounded-[3rem] p-10 max-w-md w-full shadow-2xl border border-zinc-100 dark:border-zinc-800 text-center"
      >
        <div className="w-20 h-20 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-3xl flex items-center justify-center mx-auto mb-8">
          <Trash2 className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-zinc-900 dark:text-zinc-100 mb-4">{t.confirmDelete}</h2>
        <p className="text-zinc-400 dark:text-zinc-500 font-medium mb-10">هذا الإجراء لا يمكن التراجع عنه وسيتم حذف كافة البيانات المتعلقة بهذه القطعة.</p>
        
        <div className="flex gap-4">
          <button
            onClick={onCancel}
            className="flex-1 py-4 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-black hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all"
          >
            {t.cancel}
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-4 rounded-2xl bg-red-600 text-white font-black hover:bg-red-700 transition-all shadow-xl shadow-red-200 dark:shadow-none"
          >
            {t.confirm}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default function App() {
  const [items, setItems] = useState<Item[]>([]);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('theme') as 'light' | 'dark') || 'light';
    }
    return 'light';
  });
  const [selectedItem, setSelectedItem] = useState<ItemWithBids | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<Item | null>(null);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [adminToken, setAdminToken] = useState<string | null>(localStorage.getItem('adminToken'));
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'sold'>('all');
  const [view, setView] = useState<'public' | 'admin'>('public');
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);

  const filteredItems = items.filter(item => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = item.title.toLowerCase().includes(query) || 
                          item.description.toLowerCase().includes(query) ||
                          (item.seller_notes?.toLowerCase().includes(query) || false);
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const ws = useRef<WebSocket | null>(null);

  const t = translations.ar;

  useEffect(() => {
    const root = window.document.documentElement;
    const body = window.document.body;
    if (theme === 'dark') {
      root.classList.add('dark');
      body.classList.add('dark');
    } else {
      root.classList.remove('dark');
      body.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    fetchItems();
    setupWebSocket();
    return () => ws.current?.close();
  }, []);

  const setupWebSocket = () => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const socket = new WebSocket(`${protocol}//${window.location.host}`);
    
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'ITEM_ADDED') {
        setItems(prev => {
          if (prev.some(item => item.id === data.item.id)) return prev;
          return [data.item, ...prev];
        });
      } else if (data.type === 'BID_PLACED') {
        setItems(prev => prev.map(item => 
          item.id === Number(data.itemId) ? { ...item, current_bid: data.amount } : item
        ));
        if (selectedItem?.id === Number(data.itemId)) {
          fetchItemDetails(data.itemId);
        }
      } else if (data.type === 'ITEM_UPDATED') {
        setItems(prev => prev.map(item => item.id === data.item.id ? data.item : item));
        if (selectedItem?.id === data.item.id) {
          fetchItemDetails(data.item.id);
        }
      } else if (data.type === 'ITEM_SOLD') {
        setItems(prev => prev.map(item => 
          item.id === Number(data.itemId) ? { ...item, status: 'sold' } : item
        ));
        if (selectedItem?.id === Number(data.itemId)) {
          setSelectedItem(prev => prev ? { ...prev, status: 'sold' } : null);
        }
      } else if (data.type === 'ITEM_DELETED') {
        setItems(prev => prev.filter(item => item.id !== Number(data.itemId)));
        if (selectedItem?.id === Number(data.itemId)) {
          setSelectedItem(null);
        }
      }
    };

    ws.current = socket;
  };

  const fetchItems = async () => {
    try {
      const res = await fetch('/api/items');
      const data = await res.json();
      setItems(data);
    } catch (err) {
      console.error('Failed to fetch items', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchItemDetails = async (id: number) => {
    try {
      const res = await fetch(`/api/items/${id}`);
      const data = await res.json();
      setSelectedItem(data);
    } catch (err) {
      console.error('Failed to fetch item details', err);
    }
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString() + ' ' + t.iqd;
  };

  const handleAdminLogin = async (username: string, password: string) => {
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          username: username.trim(), 
          password: password.trim() 
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setAdminToken(data.token);
        localStorage.setItem('adminToken', data.token);
        setIsAdminLoginOpen(false);
        alert("تم تسجيل الدخول بنجاح");
      } else {
        const error = await res.json();
        alert(error.error || t.errorLogin);
      }
    } catch (err) {
      console.error('Login failed', err);
      alert("حدث خطأ أثناء محاولة تسجيل الدخول");
    }
  };

  const handleLogout = () => {
    setAdminToken(null);
    localStorage.removeItem('adminToken');
  };

  const handleDeleteItem = async (id: number) => {
    if (!adminToken) {
      alert("يرجى تسجيل الدخول أولاً للقيام بهذه العملية");
      setIsAdminLoginOpen(true);
      return;
    }

    try {
      const res = await fetch(`/api/items/${id}`, {
        method: 'DELETE',
        headers: { 
          'x-admin-token': adminToken,
          'Content-Type': 'application/json'
        }
      });
      
      if (res.ok) {
        setSelectedItem(null);
        setIsDeleteConfirmOpen(false);
        setItemToDelete(null);
      } else {
        const error = await res.json();
        alert(error.error || "فشل الحذف - يرجى تسجيل الدخول مرة أخرى");
        if (res.status === 403) {
          handleLogout();
          setIsAdminLoginOpen(true);
        }
      }
    } catch (err) {
      console.error('Delete failed', err);
      alert("حدث خطأ في الاتصال - يرجى المحاولة مرة أخرى");
    }
  };

  const requestDeleteItem = (id: number) => {
    setItemToDelete(id);
    setIsDeleteConfirmOpen(true);
  };

  const handleUpdateItem = async (id: number, updatedData: any) => {
    try {
      const res = await fetch(`/api/items/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-token': adminToken || '' 
        },
        body: JSON.stringify(updatedData),
      });
      if (res.ok) {
        setIsEditModalOpen(false);
        fetchItemDetails(id);
      }
    } catch (err) {
      console.error('Update failed', err);
    }
  };

  const handleBid = async (itemId: number, bidderName: string, amount: number) => {
    try {
      const res = await fetch(`/api/items/${itemId}/bid`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bidder_name: bidderName, amount }),
      });
      if (!res.ok) {
        const error = await res.json();
        alert(t.errorBid);
        return;
      }
      fetchItemDetails(itemId);
    } catch (err) {
      console.error('Failed to place bid', err);
    }
  };

  const handleBuy = async (item: Item) => {
    try {
      const res = await fetch(`/api/items/${item.id}/buy`, { method: 'POST' });
      if (res.ok) {
        const priceStr = formatPrice(item.current_bid);
        const message = encodeURIComponent(
          `مرحباً! لقد قمت بشراء قطعتك من عالم الباخره: ${item.title} بسعر ${priceStr}. يرجى إخباري بالخطوات التالية!`
        );
        window.open(`https://wa.me/${item.seller_whatsapp}?text=${message}`, '_blank');
      }
    } catch (err) {
      console.error('Failed to buy item', err);
    }
  };

  return (
    <div className={cn("min-h-screen pb-20 bg-zinc-50 dark:bg-zinc-950 transition-colors duration-300", theme)} dir="rtl">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border-b border-zinc-200 dark:border-zinc-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#1a3673] rounded-2xl flex items-center justify-center shadow-xl shadow-zinc-200 dark:shadow-none rotate-3">
              <Ship className="text-[#eeb44f] w-7 h-7" />
            </div>
            <div>
              <h1 className="font-display text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">{t.title}</h1>
              <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-widest leading-none mt-1">Premium Auctions</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all text-zinc-600 dark:text-zinc-400"
              title={theme === 'light' ? t.darkMode : t.lightMode}
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>

            {adminToken ? (
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setView(view === 'public' ? 'admin' : 'public')}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-xl border transition-all",
                    view === 'admin' 
                      ? "bg-zinc-900 text-white border-zinc-900" 
                      : "bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100"
                  )}
                >
                  {view === 'admin' ? <Globe className="w-4 h-4" /> : <LayoutDashboard className="w-4 h-4" />}
                  <span className="text-xs font-bold hidden sm:inline">{view === 'admin' ? t.backToPublic : t.adminDashboard}</span>
                </button>
                <button 
                  onClick={handleLogout}
                  className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center hover:bg-red-50 hover:text-red-600 transition-all"
                  title={t.logout}
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setIsAdminLoginOpen(true)}
                className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center hover:bg-zinc-200 transition-all"
                title={t.adminLogin}
              >
                <LogIn className="w-5 h-5 text-zinc-600" />
              </button>
            )}

            {adminToken && (
              <button 
                onClick={() => setIsAddModalOpen(true)}
                className="btn-primary flex items-center gap-2 shadow-xl shadow-zinc-200 py-2.5 px-5"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">{t.sellItem}</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-10">
        {view === 'admin' && adminToken ? (
          <AdminDashboard 
            items={items} 
            t={t} 
            onEdit={(item) => {
              setEditItem(item);
              setIsEditModalOpen(true);
            }} 
            onDelete={requestDeleteItem}
            onViewDetails={fetchItemDetails}
          />
        ) : (
          <>
            {/* Search and Filters */}
            {!loading && items.length > 0 && (
          <div className="mb-12 flex flex-col md:flex-row gap-6 items-center justify-between">
            <div className="relative w-full md:max-w-md">
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-zinc-400" />
              </div>
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white dark:bg-zinc-900 border-2 border-zinc-100 dark:border-zinc-800 rounded-2xl py-4 pr-12 pl-4 focus:border-zinc-900 dark:focus:border-zinc-100 focus:ring-0 transition-all font-bold text-zinc-900 dark:text-zinc-100 shadow-sm"
              />
            </div>

            <div className="flex bg-zinc-100 dark:bg-zinc-900 p-1.5 rounded-2xl w-full md:w-auto">
              <button
                onClick={() => setStatusFilter('all')}
                className={cn(
                  "flex-1 md:flex-none px-6 py-2.5 rounded-xl text-sm font-black transition-all",
                  statusFilter === 'all' ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm" : "text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300"
                )}
              >
                {t.filterAll}
              </button>
              <button
                onClick={() => setStatusFilter('active')}
                className={cn(
                  "flex-1 md:flex-none px-6 py-2.5 rounded-xl text-sm font-black transition-all",
                  statusFilter === 'active' ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm" : "text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300"
                )}
              >
                {t.filterActive}
              </button>
              <button
                onClick={() => setStatusFilter('sold')}
                className={cn(
                  "flex-1 md:flex-none px-6 py-2.5 rounded-xl text-sm font-black transition-all",
                  statusFilter === 'sold' ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm" : "text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300"
                )}
              >
                {t.filterSold}
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-6">
            <div className="relative">
              <Loader2 className="w-12 h-12 animate-spin text-zinc-900 dark:text-zinc-100" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-2 h-2 bg-zinc-900 dark:bg-zinc-100 rounded-full" />
              </div>
            </div>
            <p className="text-zinc-500 dark:text-zinc-400 font-bold tracking-widest uppercase text-xs">{t.loading}</p>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-32">
            <div className="w-24 h-24 bg-white dark:bg-zinc-900 rounded-[2rem] shadow-2xl shadow-zinc-200 dark:shadow-none flex items-center justify-center mx-auto mb-8 border border-zinc-100 dark:border-zinc-800">
              <ShoppingCart className="text-zinc-200 dark:text-zinc-700 w-12 h-12" />
            </div>
            <h2 className="text-3xl font-black mb-3 text-zinc-900 dark:text-zinc-100">{t.noItems}</h2>
            <p className="text-zinc-400 dark:text-zinc-500 mb-10 max-w-md mx-auto font-medium">{t.beFirst}</p>
            {adminToken && (
              <button 
                onClick={() => setIsAddModalOpen(true)}
                className="btn-primary px-10 py-4 rounded-2xl text-lg shadow-2xl shadow-zinc-200"
              >
                {t.listNow}
              </button>
            )}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-32">
            <div className="w-24 h-24 bg-white rounded-[2rem] shadow-2xl shadow-zinc-200 flex items-center justify-center mx-auto mb-8 border border-zinc-100">
              <Search className="text-zinc-200 w-12 h-12" />
            </div>
            <h2 className="text-3xl font-black mb-3 text-zinc-900">لا توجد نتائج</h2>
            <p className="text-zinc-400 mb-10 max-w-md mx-auto font-medium">جرب البحث بكلمات أخرى أو تغيير الفلتر</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
            {filteredItems.map((item) => (
              <ItemCard 
                key={item.id} 
                item={item} 
                t={t}
                formatPrice={formatPrice}
                onClick={() => fetchItemDetails(item.id)} 
              />
            ))}
          </div>
        )}
      </>
    )}
  </main>

      {/* Modals */}
      <AnimatePresence>
        {selectedItem && (
          <ItemDetailModal 
            item={selectedItem} 
            t={t}
            isAdmin={!!adminToken}
            formatPrice={formatPrice}
            onClose={() => setSelectedItem(null)} 
            onBid={handleBid}
            onBuy={() => handleBuy(selectedItem)}
            onDelete={() => requestDeleteItem(selectedItem.id)}
            onEdit={() => {
              setEditItem(selectedItem);
              setIsEditModalOpen(true);
            }}
          />
        )}
        {isAddModalOpen && (
          <AddItemModal 
            t={t}
            onClose={() => setIsAddModalOpen(false)} 
            onSuccess={() => {
              setIsAddModalOpen(false);
              fetchItems();
            }}
          />
        )}
        {isEditModalOpen && editItem && (
          <EditItemModal 
            t={t}
            item={editItem}
            onClose={() => {
              setIsEditModalOpen(false);
              setEditItem(null);
            }} 
            onSave={(data) => handleUpdateItem(editItem.id, data)}
          />
        )}
        {isAdminLoginOpen && (
          <AdminLoginModal 
            t={t}
            onClose={() => setIsAdminLoginOpen(false)}
            onLogin={handleAdminLogin}
          />
        )}
        {isDeleteConfirmOpen && itemToDelete && (
          <DeleteConfirmModal 
            t={t}
            onConfirm={() => handleDeleteItem(itemToDelete)}
            onCancel={() => {
              setIsDeleteConfirmOpen(false);
              setItemToDelete(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

const ItemCard: React.FC<{ 
  item: Item; 
  t: any; 
  formatPrice: (p: number) => string;
  onClick: () => void | Promise<void> 
}> = ({ item, t, formatPrice, onClick }) => {
  return (
    <motion.div 
      layoutId={`item-${item.id}`}
      onClick={onClick}
      className="group bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 overflow-hidden cursor-pointer hover:shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)] transition-all duration-700 flex flex-col"
    >
      <div className="aspect-[4/5] bg-zinc-50 dark:bg-zinc-800 relative overflow-hidden">
        {item.images && item.images.length > 0 ? (
          <img 
            src={item.images[0]} 
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-200">
            <ImageIcon className="w-20 h-20" />
          </div>
        )}
        <div className="absolute top-5 inset-x-5 flex justify-between items-start">
          <span className={cn(
            "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] backdrop-blur-xl shadow-xl",
            item.status === 'active' ? "bg-white/90 text-emerald-600" : "bg-zinc-900/90 text-white"
          )}>
            {item.status === 'active' ? t.active : t.sold}
          </span>
          {item.images && item.images.length > 1 && (
            <span className="bg-black/40 backdrop-blur-xl text-white px-3 py-1.5 rounded-2xl text-[10px] font-black border border-white/10">
              +{item.images.length - 1}
            </span>
          )}
        </div>
      </div>
      <div className="p-8 flex-1 flex flex-col">
        <h3 className="font-display text-2xl font-bold leading-tight mb-3 group-hover:text-zinc-700 dark:group-hover:text-zinc-300 transition-colors text-zinc-900 dark:text-zinc-100">{item.title}</h3>
        <p className="text-zinc-400 dark:text-zinc-500 text-sm line-clamp-2 mb-8 flex-1 font-medium leading-relaxed">{item.description}</p>
        <div className="flex items-end justify-between pt-6 border-t border-zinc-50 dark:border-zinc-800">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] font-black text-zinc-300 dark:text-zinc-600 mb-2">{t.currentBid}</p>
            <p className="text-2xl font-black text-zinc-900 dark:text-zinc-100">{formatPrice(item.current_bid)}</p>
          </div>
          <div className="w-14 h-14 rounded-[1.25rem] bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center group-hover:bg-zinc-900 dark:group-hover:bg-zinc-100 group-hover:text-white dark:group-hover:text-zinc-900 transition-all duration-500 group-hover:-rotate-12 group-hover:scale-110 shadow-sm">
            <ArrowRight className={cn("w-6 h-6 transition-transform", item.status === 'sold' && "rotate-45")} />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

function ItemDetailModal({ item, t, isAdmin, formatPrice, onClose, onBid, onBuy, onDelete, onEdit }: { 
  item: ItemWithBids; 
  t: any;
  isAdmin: boolean;
  formatPrice: (p: number) => string;
  onClose: () => void; 
  onBid: (id: number, name: string, amount: number) => void;
  onBuy: () => void;
  onDelete: () => void;
  onEdit: () => void;
}) {
  const [bidAmount, setBidAmount] = useState(item.current_bid + 25000);
  const [bidderName, setBidderName] = useState('');
  const [activeImage, setActiveImage] = useState(0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-zinc-900/90 backdrop-blur-2xl"
      />
      <motion.div 
        layoutId={`item-${item.id}`}
        className="relative w-full max-w-7xl bg-white dark:bg-zinc-900 rounded-[3rem] overflow-hidden shadow-2xl flex flex-col lg:flex-row max-h-[95vh]"
      >
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 z-20 w-14 h-14 bg-white/90 dark:bg-zinc-800/90 backdrop-blur-xl rounded-full flex items-center justify-center hover:bg-white dark:hover:bg-zinc-700 transition-all border border-zinc-100 dark:border-zinc-800 shadow-2xl text-zinc-900 dark:text-zinc-100"
        >
          <X className="w-7 h-7" />
        </button>

        {/* Left: Gallery */}
        <div className="w-full lg:w-3/5 bg-zinc-50 dark:bg-zinc-950 relative flex flex-col">
          <div className="flex-1 relative overflow-hidden group">
            {item.images && item.images.length > 0 ? (
              <img 
                src={item.images[activeImage]} 
                alt={item.title}
                className="w-full h-full object-contain p-10"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-zinc-200">
                <ImageIcon className="w-40 h-40" />
              </div>
            )}
            
            {item.images && item.images.length > 1 && (
              <>
                <button 
                  onClick={() => setActiveImage(prev => (prev > 0 ? prev - 1 : item.images.length - 1))}
                  className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 backdrop-blur border border-zinc-100 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-xl"
                >
                  <ChevronLeft className="w-7 h-7" />
                </button>
                <button 
                  onClick={() => setActiveImage(prev => (prev < item.images.length - 1 ? prev + 1 : 0))}
                  className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 backdrop-blur border border-zinc-100 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-xl"
                >
                  <ChevronRight className="w-7 h-7" />
                </button>
              </>
            )}
          </div>
          
          {item.images && item.images.length > 1 && (
            <div className="p-6 flex gap-4 overflow-x-auto bg-white/30 dark:bg-zinc-900/30 backdrop-blur-xl border-t border-zinc-100 dark:border-zinc-800 scrollbar-hide">
              {item.images.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={cn(
                    "w-24 h-24 rounded-2xl overflow-hidden border-4 transition-all flex-shrink-0 shadow-sm",
                    activeImage === idx ? "border-zinc-900 scale-110 shadow-2xl" : "border-transparent opacity-40 hover:opacity-100"
                  )}
                >
                  <img src={img} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Content */}
        <div className="w-full lg:w-2/5 p-10 sm:p-14 flex flex-col overflow-y-auto bg-white dark:bg-zinc-900">
          <div className="mb-10">
            <div className="flex items-center gap-4 mb-6">
              <span className={cn(
                "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-sm",
                item.status === 'active' ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 border border-zinc-200 dark:border-zinc-700"
              )}>
                {item.status === 'active' ? t.active : t.sold}
              </span>
              <span className="text-zinc-200 dark:text-zinc-800">/</span>
              <span className="text-zinc-400 dark:text-zinc-500 text-xs font-bold tracking-widest uppercase">{new Date(item.created_at).toLocaleDateString('ar-IQ')}</span>
            </div>
            <h2 className="text-5xl font-display font-bold mb-8 tracking-tight leading-[1.1] text-zinc-900 dark:text-zinc-100">{item.title}</h2>
            <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed text-xl font-medium">{item.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-8 mb-12">
            <div className="bg-zinc-50 dark:bg-zinc-800 p-8 rounded-[2rem] border border-zinc-100 dark:border-zinc-800">
              <p className="text-[10px] uppercase tracking-[0.2em] font-black text-zinc-300 dark:text-zinc-600 mb-3">{t.startingPrice}</p>
              <p className="text-2xl font-black text-zinc-900 dark:text-zinc-100">{formatPrice(item.starting_price)}</p>
            </div>
            <div className="bg-zinc-900 dark:bg-zinc-100 p-8 rounded-[2rem] text-white dark:text-zinc-900 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 dark:bg-black/5 rounded-full -mr-10 -mt-10 blur-2xl" />
              <p className="text-[10px] uppercase tracking-[0.2em] font-black text-zinc-400 dark:text-zinc-500 mb-3 relative z-10">{t.currentBid}</p>
              <p className="text-2xl font-black relative z-10">{formatPrice(item.current_bid)}</p>
            </div>
          </div>

          {item.status === 'active' ? (
            <div className="space-y-10">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-black text-xs uppercase tracking-[0.2em] text-zinc-300">{t.placeBid}</h3>
                  {isAdmin && (
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={onEdit}
                        className="text-zinc-600 hover:text-zinc-900 flex items-center gap-2 text-xs font-bold transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                        <span>{t.editItem}</span>
                      </button>
                      <button 
                        onClick={onDelete}
                        className="text-red-500 hover:text-red-700 flex items-center gap-2 text-xs font-bold transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>{t.deleteItem}</span>
                      </button>
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-1 gap-5">
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder={t.yourName}
                      className="input-field py-5 px-6 text-lg rounded-2xl bg-zinc-50 border-transparent focus:bg-white"
                      value={bidderName}
                      onChange={(e) => setBidderName(e.target.value)}
                    />
                  </div>
                  <div className="relative">
                    <input 
                      type="number" 
                      className="input-field py-5 px-6 text-lg rounded-2xl bg-zinc-50 border-transparent focus:bg-white"
                      value={bidAmount}
                      onChange={(e) => setBidAmount(Number(e.target.value))}
                      min={item.current_bid + 1}
                    />
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-400 font-black text-sm">{t.iqd}</span>
                  </div>
                </div>
                <button 
                  onClick={() => onBid(item.id, bidderName, bidAmount)}
                  disabled={!bidderName || bidAmount <= item.current_bid}
                  className="btn-primary w-full py-6 rounded-2xl text-xl font-black flex items-center justify-center gap-4 shadow-2xl shadow-zinc-200 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  <Gavel className="w-7 h-7" />
                  <span>{t.placeBid}</span>
                </button>
              </div>

              <div className="pt-10 border-t border-zinc-100 space-y-4">
                <button 
                  onClick={onBuy}
                  className="w-full bg-zinc-900 text-white py-6 rounded-2xl font-black text-xl hover:bg-black transition-all flex items-center justify-center gap-4 shadow-2xl shadow-zinc-200 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <ShoppingCart className="w-7 h-7" />
                  <span>{t.buyNow}</span>
                </button>
                <button 
                  onClick={() => {
                    const message = encodeURIComponent(`مرحباً! أنا مهتم بقطعة: ${item.title}. هل يمكنني الحصول على مزيد من التفاصيل؟`);
                    window.open(`https://wa.me/${item.seller_whatsapp}?text=${message}`, '_blank');
                  }}
                  className="w-full bg-white text-zinc-900 border-2 border-zinc-100 py-5 rounded-2xl font-bold text-lg hover:bg-zinc-50 transition-all flex items-center justify-center gap-4"
                >
                  <MessageCircle className="w-6 h-6 text-emerald-500" />
                  <span>{t.contactSeller}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-zinc-50 p-10 rounded-[2.5rem] border border-zinc-200 text-center">
                <p className="font-black text-zinc-300 uppercase tracking-[0.4em] text-sm">{t.sold}</p>
              </div>
              {isAdmin && (
                <div className="flex gap-4">
                  <button 
                    onClick={onEdit}
                    className="flex-1 py-4 bg-zinc-100 text-zinc-900 font-bold flex items-center justify-center gap-2 hover:bg-zinc-200 rounded-2xl transition-all"
                  >
                    <Edit3 className="w-5 h-5" />
                    <span>{t.editItem}</span>
                  </button>
                  <button 
                    onClick={onDelete}
                    className="flex-1 py-4 bg-red-50 text-red-500 font-bold flex items-center justify-center gap-2 hover:bg-red-100 rounded-2xl transition-all"
                  >
                    <Trash2 className="w-5 h-5" />
                    <span>{t.deleteItem}</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Bid History */}
          <div className="mt-16">
            <h3 className="font-black text-xs uppercase tracking-[0.2em] text-zinc-300 mb-8">{t.bidHistory}</h3>
            <div className="space-y-5">
              {item.bids.length > 0 ? item.bids.map((bid) => (
                <div key={bid.id} className="flex items-center justify-between p-6 bg-zinc-50 rounded-3xl border border-zinc-100 hover:bg-white hover:shadow-xl transition-all group">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-sm font-black shadow-sm group-hover:bg-zinc-900 group-hover:text-white transition-all">
                      {bid.bidder_name[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="font-black text-zinc-900 text-lg">{bid.bidder_name}</p>
                      <p className="text-[10px] text-zinc-400 font-black uppercase tracking-widest">{new Date(bid.created_at).toLocaleTimeString('ar-IQ')}</p>
                    </div>
                  </div>
                  <p className="font-black text-zinc-900 text-xl">{formatPrice(bid.amount)}</p>
                </div>
              )) : (
                <div className="text-center py-12 bg-zinc-50 rounded-[2.5rem] border border-dashed border-zinc-200">
                  <p className="text-zinc-300 text-sm font-bold italic tracking-widest uppercase">{t.noBids}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function AdminLoginModal({ t, onClose, onLogin }: { t: any; onClose: () => void; onLogin: (u: string, p: string) => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    await onLogin(username, password);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-zinc-900/90 backdrop-blur-xl" />
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-sm bg-white dark:bg-zinc-900 rounded-[2.5rem] p-10 shadow-2xl">
        <h2 className="text-3xl font-display font-bold mb-8 text-center text-zinc-900 dark:text-zinc-100">{t.adminLogin}</h2>
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-zinc-300 dark:text-zinc-600">{t.username}</label>
            <input 
              type="text" 
              className="input-field py-4 px-5 rounded-2xl" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-zinc-300 dark:text-zinc-600">{t.password}</label>
            <input 
              type="password" 
              className="input-field py-4 px-5 rounded-2xl" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              disabled={loading}
            />
          </div>
          <button 
            onClick={handleLogin}
            disabled={loading || !username || !password}
            className="btn-primary w-full py-4 rounded-2xl font-black text-lg shadow-xl shadow-zinc-200 dark:shadow-none flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <LogIn className="w-5 h-5" />}
            <span>{t.login}</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function EditItemModal({ t, item, onClose, onSave }: { t: any; item: Item; onClose: () => void; onSave: (data: any) => void }) {
  const [formData, setFormData] = useState({
    title: item.title,
    description: item.description,
    starting_price: item.starting_price,
    current_bid: item.current_bid,
    seller_notes: item.seller_notes || '',
    status: item.status
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-zinc-900/90 backdrop-blur-xl" />
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-lg bg-white dark:bg-zinc-900 rounded-[2.5rem] p-10 shadow-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-3xl font-display font-bold mb-8 text-center text-zinc-900 dark:text-zinc-100">{t.editItem}</h2>
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-zinc-300 dark:text-zinc-600">{t.itemTitle}</label>
            <input 
              type="text" 
              className="input-field py-4 px-5 rounded-2xl" 
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-zinc-300 dark:text-zinc-600">{t.description}</label>
            <textarea 
              className="input-field py-4 px-5 rounded-2xl min-h-[100px]" 
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-zinc-300 dark:text-zinc-600">{t.sellerNotes}</label>
            <textarea 
              className="input-field py-4 px-5 rounded-2xl min-h-[80px]" 
              value={formData.seller_notes}
              onChange={(e) => setFormData({...formData, seller_notes: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-zinc-300 dark:text-zinc-600">{t.startingPrice}</label>
              <input 
                type="number" 
                className="input-field py-4 px-5 rounded-2xl" 
                value={formData.starting_price}
                onChange={(e) => setFormData({...formData, starting_price: Number(e.target.value)})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-zinc-300 dark:text-zinc-600">{t.currentBid}</label>
              <input 
                type="number" 
                className="input-field py-4 px-5 rounded-2xl" 
                value={formData.current_bid}
                onChange={(e) => setFormData({...formData, current_bid: Number(e.target.value)})}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-zinc-300 dark:text-zinc-600">الحالة</label>
            <select 
              className="input-field py-4 px-5 rounded-2xl appearance-none"
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value as any})}
            >
              <option value="active">{t.active}</option>
              <option value="sold">{t.sold}</option>
            </select>
          </div>
          <button 
            onClick={() => onSave(formData)}
            className="btn-primary w-full py-4 rounded-2xl font-black text-lg shadow-xl shadow-zinc-200 flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" />
            <span>{t.saveChanges}</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function AddItemModal({ t, onClose, onSuccess }: { t: any; onClose: () => void; onSuccess: () => void }) {
  const [loading, setLoading] = useState(false);
  const [previews, setPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    if (previews.length === 0) {
      alert(t.errorImages);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/items', {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        onSuccess();
      }
    } catch (err) {
      console.error('Failed to add item', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];
    if (files.length > 5) {
      alert("Max 5 images allowed");
      return;
    }

    const newPreviews: string[] = [];
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          newPreviews.push(reader.result);
          if (newPreviews.length === files.length) {
            setPreviews(newPreviews);
          }
        }
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-zinc-900/90 backdrop-blur-2xl"
      />
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 60 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 60 }}
        className="relative w-full max-w-3xl bg-white dark:bg-zinc-900 rounded-[3rem] overflow-hidden shadow-2xl max-h-[95vh] flex flex-col"
      >
        <div className="p-10 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/30 dark:bg-zinc-800/30">
          <h2 className="text-3xl font-display font-bold tracking-tight text-zinc-900 dark:text-zinc-100">{t.listItem}</h2>
          <button onClick={onClose} className="w-12 h-12 rounded-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all shadow-sm">
            <X className="w-7 h-7" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-10 space-y-10 overflow-y-auto">
          <div className="space-y-8">
            <div className="space-y-4">
              <label className="text-xs font-black uppercase tracking-[0.3em] text-zinc-300 dark:text-zinc-600">{t.uploadImages}</label>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  "min-h-[250px] bg-zinc-50 dark:bg-zinc-950 border-4 border-dashed border-zinc-100 dark:border-zinc-800 rounded-[2.5rem] flex flex-col items-center justify-center cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:border-zinc-200 dark:hover:border-zinc-700 transition-all p-10 group",
                  previews.length > 0 && "border-solid bg-white dark:bg-zinc-900"
                )}
              >
                {previews.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-5 w-full">
                    {previews.map((p, i) => (
                      <div key={i} className="aspect-square rounded-2xl overflow-hidden border-2 border-zinc-50 dark:border-zinc-800 shadow-xl relative group/img">
                        <img src={p} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                          <Trash2 className="text-white w-6 h-6" />
                        </div>
                      </div>
                    ))}
                    {previews.length < 5 && (
                      <div className="aspect-square rounded-2xl border-4 border-dashed border-zinc-100 dark:border-zinc-800 flex items-center justify-center text-zinc-200 dark:text-zinc-700 group-hover:text-zinc-400 dark:group-hover:text-zinc-500 transition-colors">
                        <Plus className="w-8 h-8" />
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <div className="w-20 h-20 bg-white dark:bg-zinc-800 rounded-3xl flex items-center justify-center shadow-xl mb-6 group-hover:scale-110 transition-transform duration-500">
                      <ImageIcon className="w-10 h-10 text-zinc-200 dark:text-zinc-700" />
                    </div>
                    <p className="text-lg font-bold text-zinc-600 dark:text-zinc-400">{t.uploadImages}</p>
                    <p className="text-xs text-zinc-300 dark:text-zinc-600 mt-2 font-black uppercase tracking-widest">{t.imageLimit}</p>
                  </>
                )}
                <input 
                  ref={fileInputRef}
                  type="file" 
                  name="images" 
                  className="hidden" 
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-[0.3em] text-zinc-300 dark:text-zinc-600">{t.itemTitle}</label>
              <input name="title" type="text" placeholder={t.whatSelling} className="input-field py-5 px-6 text-lg rounded-2xl bg-zinc-50 dark:bg-zinc-950 border-transparent focus:bg-white dark:focus:bg-zinc-900" required />
            </div>

            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-[0.3em] text-zinc-300 dark:text-zinc-600">{t.description}</label>
              <textarea name="description" placeholder={t.describeItem} className="input-field min-h-[150px] py-5 px-6 text-lg rounded-2xl bg-zinc-50 dark:bg-zinc-950 border-transparent focus:bg-white dark:focus:bg-zinc-900" required />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-[0.3em] text-zinc-300 dark:text-zinc-600">{t.startingPrice} ({t.iqd})</label>
                <div className="relative">
                  <input name="starting_price" type="number" placeholder="0" className="input-field py-5 px-6 text-lg rounded-2xl bg-zinc-50 dark:bg-zinc-950 border-transparent focus:bg-white dark:focus:bg-zinc-900" required />
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-300 dark:text-zinc-600 font-black text-sm">{t.iqd}</span>
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-[0.3em] text-zinc-300 dark:text-zinc-600">{t.whatsapp}</label>
                <div className="relative">
                  <MessageCircle className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-300 dark:text-zinc-600 w-6 h-6" />
                  <input name="seller_whatsapp" type="text" placeholder="964..." className="input-field py-5 pl-14 pr-6 text-lg rounded-2xl bg-zinc-50 dark:bg-zinc-950 border-transparent focus:bg-white dark:focus:bg-zinc-900" required />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-[0.3em] text-zinc-300 dark:text-zinc-600">{t.sellerNotes}</label>
              <textarea name="seller_notes" placeholder="ملاحظات إضافية للبحث أو الإدارة..." className="input-field min-h-[100px] py-5 px-6 text-lg rounded-2xl bg-zinc-50 dark:bg-zinc-950 border-transparent focus:bg-white dark:focus:bg-zinc-900" />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="btn-primary w-full py-6 rounded-2xl text-xl font-black flex items-center justify-center gap-4 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.15)] hover:scale-[1.01] active:scale-[0.99] transition-all"
          >
            {loading ? <Loader2 className="w-7 h-7 animate-spin" /> : <Plus className="w-7 h-7" />}
            <span>{t.listNow}</span>
          </button>
        </form>
      </motion.div>
    </div>
  );
}
