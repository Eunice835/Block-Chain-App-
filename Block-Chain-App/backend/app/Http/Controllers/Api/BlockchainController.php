<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Block;
use App\Services\BlockchainService;
use Illuminate\Http\Request;

class BlockchainController extends Controller
{
    public function __construct(
        protected BlockchainService $blockchainService
    ) {}

    public function index()
    {
        return response()->json(
            $this->blockchainService->getBlockchain()
        );
    }

    public function mine()
    {
        $block = $this->blockchainService->mineBlock();

        if (!$block) {
            return response()->json([
                'message' => 'No pending transactions to mine'
            ], 400);
        }

        return response()->json($block, 201);
    }

    public function validate()
    {
        $isValid = $this->blockchainService->validateChain();

        return response()->json([
            'valid' => $isValid,
            'message' => $isValid 
                ? 'Blockchain is valid and secure' 
                : 'Blockchain integrity compromised'
        ]);
    }
}
