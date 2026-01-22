<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class TransactionController extends Controller
{
    public function index()
    {
        return response()->json(Transaction::all());
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'sender' => 'required|string|max:255',
            'receiver' => 'required|string|max:255|different:sender',
            'amount' => 'required|numeric|min:0.01',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $transaction = Transaction::create([
            'sender' => $request->sender,
            'receiver' => $request->receiver,
            'amount' => $request->amount,
            'timestamp' => now(),
            'status' => 'pending',
        ]);

        return response()->json($transaction, 201);
    }

    public function pending()
    {
        return response()->json(
            Transaction::where('status', 'pending')->get()
        );
    }

    public function destroy($id)
    {
        $transaction = Transaction::find($id);

        if (!$transaction) {
            return response()->json(['message' => 'Transaction not found'], 404);
        }

        if ($transaction->status === 'mined') {
            return response()->json([
                'message' => 'Cannot delete mined transactions. Mined transactions are immutable and permanently recorded in the blockchain.'
            ], 403);
        }

        $transaction->delete();

        return response()->json([
            'message' => 'Pending transaction deleted successfully'
        ], 200);
    }
}
