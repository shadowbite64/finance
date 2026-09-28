import { API_URL } from '../config/config.ts'

export type Transaction = {
    id: string
    type: 'INCOME' | 'EXPENSE'
    amount: number
    category: string | null
    description: string | null
    transactionDate: string
    image: string | null
    createdAt: string
    updatedAt: string
}

export type TransactionPayload = {
    type: 'INCOME' | 'EXPENSE'
    amount: number | string
    category?: string
    description?: string
    transactionDate?: string
    // image?: string
}


// FETCH TRANSACTIONS
export async function fetchTransactions(): Promise<Transaction[]> {
    const response = await fetch(`${API_URL}/transactions`)

    if(!response.ok) {
        throw new Error(`Error fetching transactions ${response.statusText}`)
    }

    return response.json()
}

// FETCH TRANSACTION BY ID
export async function fetchTransactionById(id: string): Promise<Transaction> {
    const response = await fetch(`${API_URL}/transactions/${id}`)

    if(!response.ok) {
        throw new Error(`Failed to fetch transaction: ${response.statusText}`)
    }
    
    return response.json()
}

// CREATE TRANSACTION
export async function createTransaction(payload: TransactionPayload): Promise<Transaction> {
    const response = await fetch(`${API_URL}/transactions`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })

    if(!response.ok) {
        throw new Error(`Error creating transaction: ${response.statusText}`)
    }

    return response.json()
}

// UPDATE TRANSACTION
export async function updateTransaction(id: string, payload: Partial<TransactionPayload>): Promise<Transaction> {
    const response = await fetch(`${API_URL}/transactions/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })

    if(!response.ok) {
        throw new Error(`Failed to update transaction: ${response.statusText}`)
    }

    return response.json()
}

// UPLOAD IMAGE TRANSACTION
export async function uploadTransactionImage(transactionId: string, file: File): Promise<{ image: string }> {
    const formData = new FormData();
    formData.append('image', file)

    const response = await fetch(`${API_URL}/transactions/${transactionId}/image`, {
        method: 'PATCH',
        body: formData
    })

    if(!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || "Failed to update image transaction");
    }

    return response.json()
}

// DELETE TRANSACTION
export async function deleteTransaction(transactionId: string) {
    const response = await fetch(`${API_URL}/transactions/${transactionId}`, {
        method: 'DELETE'
    })

    if(!response.ok) {
        throw new Error(`Failed to delete transaction: ${response.statusText}`)
    }
}
