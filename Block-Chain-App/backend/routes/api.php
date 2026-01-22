<?php

use App\Http\Controllers\Api\BlockchainController;
use App\Http\Controllers\Api\TransactionController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/transaction', [TransactionController::class, 'store']);
Route::get('/transactions', [TransactionController::class, 'index']);
Route::get('/transactions/pending', [TransactionController::class, 'pending']);
Route::delete('/transaction/{id}', [TransactionController::class, 'destroy']);

Route::post('/block/mine', [BlockchainController::class, 'mine']);
Route::get('/blocks', [BlockchainController::class, 'index']);
Route::get('/blockchain/validate', [BlockchainController::class, 'validate']);
