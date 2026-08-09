<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Vé Sự Kiện: {{ $suKien->tieu_de }}</title>
    <style>
        body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            background-color: #f8fafc;
            margin: 0;
            padding: 20px;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
        }
        .header {
            background-color: #4f46e5;
            color: #ffffff;
            padding: 40px 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 900;
        }
        .content {
            padding: 30px;
        }
        .greeting {
            font-size: 16px;
            color: #334155;
            margin-bottom: 20px;
        }
        .ticket-box {
            border: 2px dashed #cbd5e1;
            border-radius: 12px;
            padding: 20px;
            background-color: #f8fafc;
            text-align: center;
            margin-bottom: 30px;
        }
        .qr-code {
            margin: 15px 0;
        }
        .qr-code img {
            width: 150px;
            height: 150px;
            border-radius: 8px;
        }
        .ticket-id {
            font-size: 14px;
            color: #64748b;
            font-weight: bold;
            letter-spacing: 1px;
        }
        .details {
            width: 100%;
            border-collapse: collapse;
        }
        .details th, .details td {
            padding: 12px 0;
            border-bottom: 1px solid #e2e8f0;
            text-align: left;
            font-size: 15px;
        }
        .details th {
            color: #64748b;
            font-weight: normal;
            width: 40%;
        }
        .details td {
            color: #0f172a;
            font-weight: bold;
        }
        .footer {
            background-color: #f1f5f9;
            padding: 20px;
            text-align: center;
            font-size: 13px;
            color: #64748b;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Vé Điện Tử (e-Ticket)</h1>
        </div>
        
        <div class="content">
            <p class="greeting">Xin chào <strong>{{ $dangKy->ho_ten }}</strong>,</p>
            <p style="color: #334155; line-height: 1.6; margin-bottom: 30px;">
                Cảm ơn bạn đã đăng ký tham gia sự kiện <strong>{{ $suKien->tieu_de }}</strong>. Dưới đây là mã vé điện tử dùng để check-in tại sự kiện. Bạn vui lòng lưu lại email này hoặc chụp ảnh màn hình mã QR nhé!
            </p>

            <div class="ticket-box">
                <p style="margin: 0; font-weight: bold; color: #4f46e5; font-size: 18px;">MÃ CHECK-IN CỦA BẠN</p>
                <div class="qr-code">
                    <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data={{ urlencode('TICKET-'.$dangKy->id.'-'.$user->id) }}" alt="QR Code" />
                </div>
                <div class="ticket-id">MÃ VÉ: TICKET-{{ str_pad($dangKy->id, 5, '0', STR_PAD_LEFT) }}</div>
            </div>

            <table class="details">
                <tr>
                    <th>Sự Kiện:</th>
                    <td>{{ $suKien->tieu_de }}</td>
                </tr>
                <tr>
                    <th>Thời gian bắt đầu:</th>
                    <td>{{ \Carbon\Carbon::parse($suKien->thoi_gian_bat_dau)->format('H:i - d/m/Y') }}</td>
                </tr>
                <tr>
                    <th>Địa điểm:</th>
                    <td>{{ $suKien->hinh_thuc == 1 ? 'Sự kiện trực tuyến' : $suKien->dia_diem }}</td>
                </tr>
                <tr>
                    <th>Người nhận vé:</th>
                    <td>{{ $dangKy->ho_ten }}</td>
                </tr>
            </table>
        </div>

        <div class="footer">
            <p style="margin: 0;">Email này được gửi tự động từ hệ thống. Vui lòng không trả lời.</p>
            <p style="margin: 5px 0 0 0;">&copy; {{ date('Y') }} Event Platform. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
