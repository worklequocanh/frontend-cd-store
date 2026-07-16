import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import axiosClient from '../utils/axiosClient';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, ChevronDown, MessageSquare, Sparkles, HelpCircle } from 'lucide-react';

const contactInfo = [
  {
    icon: <MapPin className="w-6 h-6 text-brand-600" />,
    title: 'Showroom Chính',
    desc: 'Số 123 Đường Công Nghệ, Quận Cầu Giấy, Hà Nội',
    sub: 'Có bãi đỗ xe ô tô miễn phí'
  },
  {
    icon: <Phone className="w-6 h-6 text-emerald-600" />,
    title: 'Hotline Hỗ Trợ 24/7',
    desc: '1900 888 999 (Kinh doanh)',
    sub: '024 777 6666 (Bảo hành kỹ thuật)'
  },
  {
    icon: <Mail className="w-6 h-6 text-violet-600" />,
    title: 'Email Hợp Tác & CSKH',
    desc: 'support@cdstore.vn',
    sub: 'Phản hồi trong vòng 2 giờ làm việc'
  },
  {
    icon: <Clock className="w-6 h-6 text-amber-600" />,
    title: 'Giờ Mở Cửa Showroom',
    desc: '08:00 - 22:00 (Tất cả các ngày)',
    sub: 'Hỗ trợ online suốt 24/7'
  }
];

const faqs = [
  {
    question: 'Chính sách bảo hành sản phẩm tại CD Store diễn ra như thế nào?',
    answer: 'Tất cả sản phẩm bán ra tại CD Store đều được áp dụng chính sách bảo hành chính hãng từ 12 đến 36 tháng. Đặc biệt, khách hàng được hưởng quyền lợi 1 ĐỔI 1 ngay lập tức trong 30 ngày đầu tiên nếu phát hiện lỗi phần cứng từ nhà sản xuất.'
  },
  {
    question: 'Tôi có thể mua trả góp 0% tại cửa hàng không?',
    answer: 'Có! CD Store hỗ trợ trả góp 0% lãi suất qua thẻ tín dụng của hơn 25 ngân hàng, hoặc qua các công ty tài chính uy tín chỉ với CCCD/CMND, thủ tục duyệt siêu tốc chỉ trong 15 phút.'
  },
  {
    question: 'Cửa hàng có hỗ trợ giao hàng tận nơi nhanh trong ngày không?',
    answer: 'Đối với các đơn hàng tại nội thành Hà Nội và TP. Hồ Chí Minh, CD Store hỗ trợ giao nhanh hỏa tốc trong 2 giờ. Đối với các tỉnh thành khác, thời gian nhận hàng từ 1 đến 3 ngày làm việc (được kiểm tra hàng trước khi thanh toán).'
  },
  {
    question: 'Làm thế nào để tra cứu tình trạng đơn hàng hoặc sửa chữa?',
    answer: 'Bạn có thể đăng nhập vào tài khoản trên website, chọn mục "My Orders" để tra cứu tiến độ vận chuyển chi tiết, hoặc gọi trực tiếp vào Hotline bảo hành 024 777 6666 cung cấp số điện thoại đặt hàng để được hỗ trợ tức thì.'
  }
];

function FAQAccordion({ item, isOpen, onClick }) {
  return (
    <div className="border border-slate-200 rounded-2xl overflow-hidden transition-all duration-200 bg-white shadow-sm">
      <button
        onClick={onClick}
        className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 font-semibold text-slate-800 hover:text-brand-600 hover:bg-slate-50 transition-colors"
      >
        <span className="flex items-center gap-2.5">
          <HelpCircle className="w-4 h-4 text-brand-500 shrink-0" />
          <span>{item.question}</span>
        </span>
        <ChevronDown className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-brand-600' : ''}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-4 pt-1 text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
              {item.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Hỗ trợ kỹ thuật & Bảo hành',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error('Vui lòng điền đầy đủ các thông tin bắt buộc');
      return;
    }

    setIsSubmitting(true);
    try {
      await axiosClient.post('/api/contact', formData);
      toast.success('Lời nhắn của bạn đã được gửi thành công!');
      setSubmittedSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: 'Hỗ trợ kỹ thuật & Bảo hành',
        message: ''
      });
    } catch (error) {
      console.error('Error submitting contact form:', error);
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi gửi lời nhắn. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Hero Header */}
      <section className="hero-bg text-white py-16 md:py-24 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(79,70,229,0.15),transparent_50%)] pointer-events-none"></div>
        <div className="container mx-auto max-w-4xl relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-brand-300 text-xs font-semibold uppercase tracking-wider">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Kết nối với chúng tôi</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight">
            Chúng Tôi Luôn Ở Đây Để <span className="text-gradient-light">Lắng Nghe Bạn</span>
          </h1>
          <p className="text-slate-300 text-base md:text-lg max-w-2xl mx-auto font-light">
            Mọi ý kiến đóng góp, yêu cầu hỗ trợ kỹ thuật hay hợp tác kinh doanh đều là động lực quý giá để CD Store hoàn thiện dịch vụ mỗi ngày.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="container mx-auto px-4 max-w-6xl -mt-10 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Contact Cards & FAQ */}
          <div className="lg:col-span-6 space-y-8">
            
            {/* Contact Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {contactInfo.map((info, idx) => (
                <div
                  key={idx}
                  className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center mb-4">
                    {info.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-base mb-1">{info.title}</h3>
                    <p className="text-sm font-semibold text-slate-900 mb-1">{info.desc}</p>
                    <p className="text-xs text-slate-400">{info.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* FAQ Accordions */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
                <Sparkles className="w-5 h-5 text-brand-600" />
                <h2 className="font-display font-bold text-lg text-slate-900">Câu Hỏi Thường Gặp</h2>
              </div>
              <div className="space-y-3 pt-1">
                {faqs.map((faq, idx) => (
                  <FAQAccordion
                    key={idx}
                    item={faq}
                    isOpen={openFaq === idx}
                    onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                  />
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Contact Message Form */}
          <div className="lg:col-span-6">
            <div className="bg-white p-8 md:p-10 rounded-3xl border border-slate-200 shadow-xl shadow-slate-900/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-brand-500/10 to-transparent rounded-bl-full pointer-events-none"></div>

              <div className="mb-6">
                <h2 className="text-2xl font-display font-bold text-slate-900">Gửi Lời Nhắn Trực Tiếp</h2>
                <p className="text-sm text-slate-500 mt-1">
                  Đội ngũ CSKH sẽ phản hồi qua email hoặc hotline trong vòng 24 giờ.
                </p>
              </div>

              {submittedSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center space-y-4 my-6"
                >
                  <div className="w-16 h-16 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/30 animate-bounce">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="font-display font-bold text-xl text-emerald-900">Đã Nhận Được Lời Nhắn!</h3>
                  <p className="text-sm text-emerald-700 leading-relaxed max-w-md mx-auto">
                    Cảm ơn bạn đã liên hệ. Chúng tôi đã gửi email xác nhận chi tiết lời nhắn tới hộp thư của bạn và sẽ nhanh chóng phản hồi sớm nhất.
                  </p>
                  <button
                    onClick={() => setSubmittedSuccess(false)}
                    className="mt-4 px-6 py-2.5 bg-emerald-600 text-white font-semibold text-sm rounded-full hover:bg-emerald-700 transition-colors shadow-sm"
                  >
                    Gửi Lời Nhắn Khác
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                        Họ và Tên <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Nguyễn Văn A"
                        required
                        className="input-base"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                        Số Điện Thoại
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="0988 xxx xxx"
                        className="input-base"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                      Địa Chỉ Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      required
                      className="input-base"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                      Chủ Đề Hỗ Trợ <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="input-base bg-white cursor-pointer"
                    >
                      <option value="Hỗ trợ kỹ thuật & Bảo hành">Hỗ trợ kỹ thuật & Bảo hành</option>
                      <option value="Tư vấn chọn mua sản phẩm">Tư vấn chọn mua sản phẩm</option>
                      <option value="Tra cứu tình trạng đơn hàng">Tra cứu tình trạng đơn hàng</option>
                      <option value="Hợp tác doanh nghiệp / Đại lý">Hợp tác doanh nghiệp / Đại lý</option>
                      <option value="Góp ý chất lượng dịch vụ">Góp ý chất lượng dịch vụ</option>
                      <option value="Khác">Khác</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                      Nội Dung Lời Nhắn <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={5}
                      placeholder="Mô tả chi tiết vấn đề hoặc yêu cầu của bạn..."
                      required
                      className="input-base resize-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full btn-primary flex items-center justify-center gap-2 py-3.5 shadow-lg shadow-brand-500/25"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Đang Gửi Lời Nhắn...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Gửi Lời Nhắn Ngay</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Google Maps / Location Section */}
      <section className="container mx-auto px-4 max-w-6xl mt-16">
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-display font-bold text-lg text-slate-900">Vị Trí Showroom Trung Tâm</h3>
              <p className="text-sm text-slate-500">Số 123 Đường Công Nghệ, Cầu Giấy, Hà Nội — Mở cửa từ 08:00 đến 22:00 hàng ngày</p>
            </div>
            <a
              href="https://maps.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1 shrink-0"
            >
              <span>Xem trên Google Maps</span>
              <span>↗</span>
            </a>
          </div>
          {/* Map Embed Preview */}
          <div className="relative w-full h-80 sm:h-96 bg-slate-100 overflow-hidden">
            <iframe
              title="Showroom Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.863855881405!2d105.78013037503166!3d21.03813278061358!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab354920c233%3A0x5d0313a3bf38fe40!2zQ-G6p3UgR2nhuqV5LCBIw6AgTuG7mWksIFZp4buHdCBOYW0!5e0!3m2!1svi!2s!4v1718000000000!5m2!1svi!2s"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ContactPage;
