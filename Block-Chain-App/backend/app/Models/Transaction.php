<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Transaction extends Model
{
    protected $fillable = [
        'sender',
        'receiver',
        'amount',
        'timestamp',
        'status',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'timestamp' => 'datetime',
    ];

    public function blocks(): BelongsToMany
    {
        return $this->belongsToMany(Block::class, 'block_transactions');
    }
}
