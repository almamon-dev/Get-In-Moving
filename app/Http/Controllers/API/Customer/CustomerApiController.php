<?php

namespace App\Http\Controllers\API\Customer;

use App\Http\Controllers\Controller;
use App\Services\AiExtractionService;
use App\Services\InvoicePaymentService;
use App\Traits\ApiResponse;

/**
 * CustomerApiController
 * 
 * Lightweight API facade controller that delegates domain-specific logic to:
 * - CustomerQuoteController
 * - CustomerOrderController
 * - CustomerInvoiceController
 * - CustomerPayLaterController
 * - CustomerNotificationController
 * - CustomerDashboardController
 */
class CustomerApiController extends Controller
{
    use ApiResponse;

    protected $paymentService;
    protected $aiService;

    protected $dashboardController;
    protected $quoteController;
    protected $orderController;
    protected $invoiceController;
    protected $payLaterController;
    protected $notificationController;

    public function __construct(InvoicePaymentService $paymentService, AiExtractionService $aiService)
    {
        $this->paymentService = $paymentService;
        $this->aiService = $aiService;

        $this->dashboardController = new CustomerDashboardController();
        $this->quoteController = new CustomerQuoteController($aiService);
        $this->orderController = new CustomerOrderController();
        $this->invoiceController = new CustomerInvoiceController($paymentService);
        $this->payLaterController = new CustomerPayLaterController();
        $this->notificationController = new CustomerNotificationController();
    }

    /**
     * Magic call forwarder to guarantee 100% backward compatibility
     */
    public function __call($method, $parameters)
    {
        foreach ([
            $this->dashboardController,
            $this->quoteController,
            $this->orderController,
            $this->invoiceController,
            $this->payLaterController,
            $this->notificationController,
        ] as $controller) {
            if (method_exists($controller, $method)) {
                return call_user_func_array([$controller, $method], $parameters);
            }
        }

        return parent::__call($method, $parameters);
    }
}
