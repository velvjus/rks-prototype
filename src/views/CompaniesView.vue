<script setup lang="ts">
import { mockData } from '@/data/mockData'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Search, Plus, Filter, MoreHorizontal } from 'lucide-vue-next'
</script>

<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-gray-900">Companies</h1>
        <p class="text-sm text-muted-foreground mt-0.5">Manage and track your B2B accounts.</p>
      </div>
      <Button variant="primary" class="gap-2 hover:scale-[1.01] active:scale-[0.97] transition-all">
        <Plus class="w-4 h-4" />
        Add Company
      </Button>
    </div>

    <!-- Data Controls -->
    <div class="flex flex-col sm:flex-row gap-3 justify-between items-center bg-white p-4 rounded-2xl border border-gray-200">
      <div class="relative w-full sm:w-72">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search companies..."
          class="w-full pl-9 pr-4 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary bg-gray-50 transition-all"
        />
      </div>
      <div class="flex gap-2 w-full sm:w-auto">
        <Button variant="outline" class="gap-2 text-gray-600 bg-gray-50 hover:bg-gray-100">
          <Filter class="w-4 h-4" />
          Filter
        </Button>
        <Button variant="outline" class="text-gray-600 bg-gray-50 hover:bg-gray-100">
          Export
        </Button>
      </div>
    </div>

    <!-- Data Table -->
    <div class="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm text-left">
          <thead class="text-xs text-muted-foreground bg-muted/40 border-b border-border">
            <tr>
              <th class="px-5 py-3 font-semibold uppercase tracking-wide whitespace-nowrap">Company ID</th>
              <th class="px-5 py-3 font-semibold uppercase tracking-wide whitespace-nowrap">Company Name</th>
              <th class="px-5 py-3 font-semibold uppercase tracking-wide whitespace-nowrap">Industry</th>
              <th class="px-5 py-3 font-semibold uppercase tracking-wide whitespace-nowrap">Employees</th>
              <th class="px-5 py-3 font-semibold uppercase tracking-wide whitespace-nowrap">MRR</th>
              <th class="px-5 py-3 font-semibold uppercase tracking-wide whitespace-nowrap">Status</th>
              <th class="px-5 py-3 font-semibold uppercase tracking-wide text-right whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr
              v-for="company in mockData.companies"
              :key="company.id"
              class="hover:bg-muted/50 transition-colors group"
            >
              <td class="px-5 py-2.5 text-xs text-muted-foreground font-mono">{{ company.id }}</td>
              <td class="px-5 py-2.5 font-semibold text-gray-900">{{ company.name }}</td>
              <td class="px-5 py-2.5 text-gray-600">{{ company.industry }}</td>
              <td class="px-5 py-2.5 text-gray-600">{{ company.employees.toLocaleString() }}</td>
              <td class="px-5 py-2.5 text-gray-900 font-medium">{{ company.mrr }}</td>
              <td class="px-5 py-2.5">
                <Badge :variant="company.status === 'Active' ? 'vibrant' : (company.status === 'Pending' ? 'muted' : 'outline')">
                  {{ company.status }}
                </Badge>
              </td>
              <td class="px-5 py-2.5 text-right">
                <Button variant="ghost" size="sm" class="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span class="sr-only">Open menu</span>
                  <MoreHorizontal class="h-4 w-4 text-gray-500" />
                </Button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- Pagination -->
      <div class="flex items-center justify-between px-5 py-3 border-t border-gray-100 bg-muted/30">
        <span class="text-xs text-muted-foreground">Showing 1 to {{ mockData.companies.length }} of 42 results</span>
        <div class="flex gap-1">
          <Button variant="outline" size="sm" class="h-7 text-xs" disabled>Previous</Button>
          <Button variant="outline" size="sm" class="h-7 text-xs">Next</Button>
        </div>
      </div>
    </div>
  </div>
</template>
