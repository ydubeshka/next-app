import { Sidebar } from '@/components/Sidebar';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { deleteProduct } from '@/lib/actions/products';
import Pagination from '@/components/Pagination';

export default async function InventoryPage({
  searchParams,
}: Readonly<{ searchParams: Promise<{ query?: string; page?: string }> }>) {
  const user = await getCurrentUser();
  const userId = user.id;
  const params = await searchParams;
  const query = (params.query ?? '').trim();


  const where = {
    userId,
    ...(query
      ? {
          name: {
            contains: query,
            mode: 'insensitive' as const,
          },
        }
      : {}),
  };

  const pageSize = 10;
  const currentPage = Math.max(1, Number(params.page ?? 1));
  const [totalCount, items] = await Promise.all([
    prisma.product.count({ where }),
    prisma.product.findMany({
      where,
      orderBy: {createdAt: 'desc'},
      skip: (currentPage - 1) * pageSize,
      take: pageSize
    }),
  ]);
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  return (
    <div className="min-h-screen bg-gray-50 ">
      <Sidebar currentPath={'/inventory'} />
      <main className={'ml-64  p-8'}>
        <div className={'mb-8'}>
          <div className={'flex items-center justify-between'}>
            <div>
              <h1 className={'text-2xl font-semibold text-gray-900'}>Inventory</h1>
              <p className={'text-sm text-gray-500'}>
                Manage your products and track inventory levels.
              </p>
            </div>
          </div>
        </div>
        <div className={'space-y-6'}>
          {/*  Search  */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <form className="flex gap-2" action="/inventory" method="GET">
              <input
                type="text"
                name="query"
                placeholder="Search products..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:border-transparent"
              />
              <button className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 cursor-pointer">
                Search
              </button>
            </form>
          </div>
          {/*  Product table  */}
          <div className={'bg-white rounded-lg border border-gray-200 overflow-hidden'}>
            <table className="w-full">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    SKU
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    LowStockAt
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {items.map((product, key) => (
                  <tr key={key} className="hover:bg-gray-50">
                    <td className="px-6 py-4  text-sm text-gray-500">{product.name}</td>
                    <td className="px-6 py-4  text-sm text-gray-500">{product.sku || '-'}</td>
                    <td className="px-6 py-4  text-sm text-gray-500">
                      {Number(product.price).toFixed(2)}
                    </td>
                    <td className="px-6 py-4  text-sm text-gray-500">{product.quantity}</td>
                    <td className="px-6 py-4  text-sm text-gray-500">
                      {product.lowStockAt || '-'}
                    </td>
                    <td className="px-6 py-4  text-sm text-gray-500">
                      <form
                        action={async (FormData: FormData) => {
                          'use server';
                          await deleteProduct(FormData);
                        }}
                      >
                        <input type="hidden" name="productId" value={product.id} />
                        <button className="text-red-600 hover:text-red-900">Delete</button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                baseUrl="/inventory"
                searchParams={{
                  query: query,
                  pageSize: String(pageSize),
                }}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
