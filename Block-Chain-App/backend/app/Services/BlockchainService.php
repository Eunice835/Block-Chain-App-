<?php

namespace App\Services;

use App\Models\Block;
use App\Models\Transaction;
use Illuminate\Support\Facades\DB;

class BlockchainService
{
    private int $difficulty = 1;

    public function generateHash(Block $block, ?string $cachedTxData = null): string
    {
        if ($cachedTxData === null) {
            $transactions = $block->transactions;
            $transactionData = '';
            foreach ($transactions as $tx) {
                $transactionData .= $tx->sender . $tx->receiver . $tx->amount . $tx->timestamp;
            }
        } else {
            $transactionData = $cachedTxData;
        }

        $data = $block->index_no .
                $block->timestamp .
                $transactionData .
                $block->previous_hash .
                $block->nonce;

        return hash('sha256', $data);
    }

    public function mineBlock(): ?Block
    {
        return DB::transaction(function () {
            $pendingTransactions = Transaction::where('status', 'pending')->get();

            if ($pendingTransactions->isEmpty()) {
                return null;
            }

            $lastBlock = Block::orderBy('index_no', 'desc')->first();
            $index = $lastBlock ? $lastBlock->index_no + 1 : 0;
            $previousHash = $lastBlock ? $lastBlock->current_hash : '0';

            $block = new Block([
                'index_no' => $index,
                'previous_hash' => $previousHash,
                'timestamp' => now(),
                'nonce' => 0,
                'current_hash' => '',
            ]);
            $block->save();

            $block->transactions()->attach($pendingTransactions->pluck('id'));
            $block->load('transactions');

            $transactionData = '';
            foreach ($pendingTransactions as $tx) {
                $transactionData .= $tx->sender . $tx->receiver . $tx->amount . $tx->timestamp;
            }

            $prefix = str_repeat('0', $this->difficulty);
            $nonce = 0;

            do {
                $block->nonce = $nonce;
                $hash = $this->generateHash($block, $transactionData);
                $nonce++;
            } while (substr($hash, 0, $this->difficulty) !== $prefix);

            $block->current_hash = $hash;
            $block->save();

            foreach ($pendingTransactions as $transaction) {
                $transaction->status = 'mined';
                $transaction->save();
            }

            return $block->fresh()->load('transactions');
        });
    }

    public function validateChain(): bool
    {
        $blocks = Block::orderBy('index_no', 'asc')->get();

        if ($blocks->isEmpty()) {
            return true;
        }

        foreach ($blocks as $index => $block) {
            $recalculatedHash = $this->generateHash($block);
            
            if ($block->current_hash !== $recalculatedHash) {
                return false;
            }

            if ($index > 0) {
                $previousBlock = $blocks[$index - 1];
                if ($block->previous_hash !== $previousBlock->current_hash) {
                    return false;
                }
            }

            $prefix = str_repeat('0', $this->difficulty);
            if (substr($block->current_hash, 0, $this->difficulty) !== $prefix) {
                return false;
            }
        }

        return true;
    }

    public function getBlockchain(): array
    {
        return Block::with('transactions')
            ->orderBy('index_no', 'asc')
            ->get()
            ->toArray();
    }
}
