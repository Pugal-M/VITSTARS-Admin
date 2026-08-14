export class MockQueryBuilder {
  table: string;
  query: {
    select?: string;
    insert?: any;
    update?: any;
    delete?: boolean;
    eq?: { column: string; value: any }[];
    in?: { column: string; values: any[] }[];
    order?: { column: string; ascending: boolean }[];
    single?: boolean;
    count?: string;
  };

  constructor(table: string) {
    this.table = table;
    this.query = {};
  }

  select(columns: string = '*', options?: { count?: string, head?: boolean }) {
    this.query.select = columns;
    if (options?.count) this.query.count = options.count;
    return this;
  }

  insert(data: any) {
    this.query.insert = data;
    return this;
  }

  update(data: any) {
    this.query.update = data;
    return this;
  }

  delete() {
    this.query.delete = true;
    return this;
  }

  eq(column: string, value: any) {
    if (!this.query.eq) this.query.eq = [];
    this.query.eq.push({ column, value });
    return this;
  }

  in(column: string, values: any[]) {
    if (!this.query.in) this.query.in = [];
    this.query.in.push({ column, values });
    return this;
  }

  order(column: string, options: { ascending?: boolean } = {}) {
    if (!this.query.order) this.query.order = [];
    this.query.order.push({ column, ascending: options.ascending !== false });
    return this;
  }

  single() {
    this.query.single = true;
    return this;
  }

  // Simulating await
  async then(resolve: (value: any) => void, reject: (reason?: any) => void) {
    try {
      const result = await this.execute();
      resolve(result);
    } catch (e) {
      reject(e);
    }
  }

  private async execute() {
    await new Promise(r => setTimeout(r, 100)); // Simulate network latency

    let data = JSON.parse(localStorage.getItem(`sb_mock_${this.table}`) || '[]');
    
    // Convert single object to array for array operations if it's somehow not an array
    if (!Array.isArray(data)) {
      data = [];
    }

    if (this.query.insert) {
      const isArray = Array.isArray(this.query.insert);
      const itemsToInsert = isArray ? this.query.insert : [this.query.insert];
      
      const newItems = itemsToInsert.map((item: any) => ({
        id: item.id || crypto.randomUUID(),
        created_at: new Date().toISOString(),
        ...item
      }));

      data = [...data, ...newItems];
      localStorage.setItem(`sb_mock_${this.table}`, JSON.stringify(data));
      
      return { data: this.query.single ? newItems[0] : newItems, error: null };
    }

    // Apply filters
    if (this.query.eq) {
      for (const eq of this.query.eq) {
        data = data.filter((item: any) => item[eq.column] === eq.value);
      }
    }

    if (this.query.in) {
      for (const inFilter of this.query.in) {
        data = data.filter((item: any) => inFilter.values.includes(item[inFilter.column]));
      }
    }

    if (this.query.update) {
      let updatedItems: any[] = [];
      const allData = JSON.parse(localStorage.getItem(`sb_mock_${this.table}`) || '[]');
      
      const newData = allData.map((item: any) => {
        // Check if this item is in our filtered set
        const shouldUpdate = data.some((d: any) => d.id === item.id);
        if (shouldUpdate) {
          const updated = { ...item, ...this.query.update };
          updatedItems.push(updated);
          return updated;
        }
        return item;
      });

      localStorage.setItem(`sb_mock_${this.table}`, JSON.stringify(newData));
      return { data: this.query.single ? updatedItems[0] : updatedItems, error: null };
    }

    if (this.query.delete) {
      const allData = JSON.parse(localStorage.getItem(`sb_mock_${this.table}`) || '[]');
      const newData = allData.filter((item: any) => !data.some((d: any) => d.id === item.id));
      localStorage.setItem(`sb_mock_${this.table}`, JSON.stringify(newData));
      return { data: null, error: null };
    }

    // Sort
    if (this.query.order) {
      for (const order of this.query.order) {
        data.sort((a: any, b: any) => {
          const valA = a[order.column];
          const valB = b[order.column];
          if (valA < valB) return order.ascending ? -1 : 1;
          if (valA > valB) return order.ascending ? 1 : -1;
          return 0;
        });
      }
    }

    let finalData = data;
    
    // In a real mock we'd apply column selection, but for this prototype returning all is fine
    // as TS will allow it and it won't break the UI.

    if (this.query.single) {
      finalData = data.length > 0 ? data[0] : null;
      if (!finalData) {
        return { data: null, error: { message: 'Row not found' } };
      }
    }

    const count = this.query.count === 'exact' ? data.length : null;

    return { 
      data: finalData, 
      error: null,
      ...(count !== null ? { count } : {})
    };
  }
}

export const mockSupabase = {
  from(table: string) {
    return new MockQueryBuilder(table);
  },
  auth: {
    signInWithPassword: async (credentials: any) => {
      console.log('Mock signInWithPassword', credentials);
      return { data: { user: { id: 'dummy' } }, error: null };
    },
    signOut: async () => {
      console.log('Mock signOut');
      return { error: null };
    }
  },
  rpc: async (fnName: string, args: any) => {
    console.log('Mock RPC call:', fnName, args);
    // Add specific RPC mocks here if needed
    if (fnName === 'create_student_user') {
      return { error: null };
    }
    if (fnName === 'delete_student_user') {
      return { error: null };
    }
    return { data: null, error: null };
  }
};
