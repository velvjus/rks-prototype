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
        <h1 class="text-2xl font-bold tracking-tight text-foreground">Companies</h1>
        <p class="text-sm text-muted-foreground mt-0.5">Manage and track your B2B accounts.</p>
      </div>
      <Button variant="primary" class="gap-2 hover:scale-[1.01] active:scale-[0.97] transition-all">
        <Plus class="w-4 h-4" />
        Add Company
      </Button>
    </div>

    <!-- Data Controls -->
    <div class="flex flex-col sm:flex-row gap-3 justify-between items-center bg-card p-4 rounded-2xl border border-border">
      <div class="relative w-full sm:w-72">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search companies..."
          class="w-full pl-9 pr-4 py-1.5 text-sm border border-input rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary bg-background transition-all text-foreground placeholder:text-muted-foreground"
        />
      </div>
      <div class="flex gap-2 w-full sm:w-auto">
        <Button variant="outline" class="gap-2 text-foreground bg-muted hover:bg-muted/80">
          <Filter class="w-4 h-4" />
          Filter
        </Button>
        <Button variant="outline" class="text-foreground bg-muted hover:bg-muted/80">
          Export
        </Button>
      </div>
    </div>

    <!-- Data Table -->
    <div class="bg-card rounded-2xl border border-border overflow-hidden">
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
          <tbody class="divide-y divide-border">
            <tr
              v-for="company in mockData.companies"
              :key="company.id"
              class="hover:bg-muted/50 transition-colors group"
            >
              <td class="px-5 py-2.5 text-xs text-muted-foreground font-mono">{{ company.id }}</td>
              <td class="px-5 py-2.5 font-semibold text-foreground">{{ company.name }}</td>
              <td class="px-5 py-2.5 text-muted-foreground">{{ company.industry }}</td>
              <td class="px-5 py-2.5 text-muted-foreground">{{ company.employees.toLocaleString() }}</td>
              <td class="px-5 py-2.5 text-foreground font-medium">{{ company.mrr }}</td>
              <td class="px-5 py-2.5">
                <Badge :variant="company.status === 'Active' ? 'success' : (company.status === 'Pending' ? 'warning' : 'outline')">
                  {{ company.status }}
                </Badge>
              </td>
              <td class="px-5 py-2.5 text-right">
                <Button variant="ghost" size="sm" class="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span class="sr-only">Open menu</span>
                  <MoreHorizontal class="h-4 w-4 text-muted-foreground" />
                </Button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- Pagination -->
      <div class="flex items-center justify-between px-5 py-3 border-t border-border bg-muted/30">
        <span class="text-xs text-muted-foreground">Showing 1 to {{ mockData.companies.length }} of 42 results</span>
        <div class="flex gap-1">
          <Button variant="outline" size="sm" class="h-7 text-xs" disabled>Previous</Button>
          <Button variant="outline" size="sm" class="h-7 text-xs">Next</Button>
        </div>
      </div>
    </div>
  </div>
</template>
