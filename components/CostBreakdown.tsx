import React from 'react';
import { CostItem } from '../types';
import { DollarSign, PieChart } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface Props {
  costs: CostItem[];
}

const CostBreakdown: React.FC<Props> = ({ costs }) => {
  const grandTotal = costs.reduce((acc, item) => acc + item.total, 0);

  return (
    <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="glass-panel p-6 rounded-xl border border-gray-700">
                <h3 className="text-gray-400 text-sm font-medium">Estimated Total Budget</h3>
                <p className="text-4xl font-bold text-white mt-2">${grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                <p className="text-xs text-green-400 mt-2">Optimized for maximum efficiency</p>
            </div>
            <div className="glass-panel p-6 rounded-xl border border-gray-700 md:col-span-2">
                 <h3 className="text-gray-400 text-sm font-medium mb-4">Cost Distribution</h3>
                 <div className="h-24 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={costs} layout="vertical">
                            <XAxis type="number" hide />
                            <YAxis dataKey="category" type="category" width={80} tick={{fontSize: 10, fill: '#9ca3af'}} />
                            <Tooltip 
                                contentStyle={{backgroundColor: '#111827', borderColor: '#374151', color: '#fff'}}
                                itemStyle={{color: '#fff'}}
                                cursor={{fill: 'rgba(255,255,255,0.05)'}}
                            />
                            <Bar dataKey="total" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={12} />
                        </BarChart>
                    </ResponsiveContainer>
                 </div>
            </div>
        </div>

      <div className="glass-panel rounded-xl overflow-hidden border border-gray-700">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-800/50 border-b border-gray-700 text-xs text-gray-400 uppercase">
              <th className="p-4 font-medium">Category</th>
              <th className="p-4 font-medium">Line Item Description</th>
              <th className="p-4 font-medium text-right">Unit Cost</th>
              <th className="p-4 font-medium text-right">Qty</th>
              <th className="p-4 font-medium text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {costs.map((item, idx) => (
              <tr key={idx} className="hover:bg-gray-800/30 transition-colors text-sm text-gray-300">
                <td className="p-4 font-semibold text-purple-400">{item.category}</td>
                <td className="p-4">{item.description}</td>
                <td className="p-4 text-right font-mono text-gray-500">${item.unitCost.toFixed(4)}</td>
                <td className="p-4 text-right font-mono">{item.quantity.toLocaleString()}</td>
                <td className="p-4 text-right font-mono text-white font-medium">${item.total.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CostBreakdown;