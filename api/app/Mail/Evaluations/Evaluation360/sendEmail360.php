<?php

namespace App\Mail\Evaluations\Evaluation360;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Queue\SerializesModels;

class sendEmail360 extends Mailable
{
    use Queueable, SerializesModels;
    public $evaluation_name;
    public $evaluated_user;

    public $email;
    public $end_date;
    /**
     * Create a new message instance.
     */
    public function __construct($evaluation_name, $evaluated_user, $email,$end_date)
    {
        $this->evaluation_name = $evaluation_name;
        $this->evaluated_user = $evaluated_user;
        $this->email = $email;
        $this->end_date = $end_date;

    }

    /**
     * Get the message envelope.
     */ //brenda.ortiz@trinitas.mx
    public function envelope(): Envelope
    {
        return new Envelope(
            from: new Address($this->email),
            replyTo: [
                new Address('notificaciones@trintias.com', $this->evaluation_name),
            ],
            subject: 'Evaluaciones pendientes'
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'Evaluations/Evaluation',
            with: [
                'evaluation_name' => $this->evaluation_name,
                'evaluated_user' => $this->evaluated_user,
                'end_date'=>$this->end_date
            ]
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
