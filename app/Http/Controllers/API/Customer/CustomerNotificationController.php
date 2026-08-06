<?php

namespace App\Http\Controllers\API\Customer;

use App\Http\Controllers\Controller;
use App\Http\Resources\API\Customer\NotificationResource;
use App\Traits\ApiResponse;

class CustomerNotificationController extends Controller
{
    use ApiResponse;

    /**
     * Get paginated notifications for the customer.
     */
    public function getNotifications()
    {
        $notifications = auth()->user()->notifications()->latest()->get();

        return $this->sendResponse([
            'notifications' => NotificationResource::collection($notifications),
            'unread_count' => auth()->user()->unreadNotifications()->count(),
        ], 'Notifications retrieved successfully.');
    }

    /**
     * Mark a specific notification as read.
     */
    public function markNotificationRead($id)
    {
        $notification = auth()->user()->notifications()->find($id);

        if (! $notification) {
            return $this->sendError('Notification not found.', [], 404);
        }

        $notification->markAsRead();

        return $this->sendResponse([], 'Notification marked as read.');
    }

    /**
     * Mark all notifications as read.
     */
    public function markAllNotificationsRead()
    {
        auth()->user()->unreadNotifications->markAsRead();

        return $this->sendResponse([], 'All notifications marked as read.');
    }
}
