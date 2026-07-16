import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Sparkles, Heart, Award, Users, CheckCircle2, Zap, Trophy, TrendingUp, ChevronRight, ArrowRight } from 'lucide-react';

const stats = [
  { label: 'Khách hàng hài lòng', value: 15000, suffix: '+', icon: <Users className="w-6 h-6 text-brand-500" /> },
  { label: 'Sản phẩm chính hãng', value: 100, suffix: '%', icon: <Shield className="w-6 h-6 text-emerald-500" /> },
  { label: 'Năm uy tín thương hiệu', value: 6, suffix: '+', icon: <Award className="w-6 h-6 text-amber-500" /> },
  { label: 'Đơn hàng hoàn thành', value: 48000, suffix: '+', icon: <Trophy className="w-6 h-6 text-violet-500" /> },
];

const values = [
  {
    title: 'Chất Lượng Tối Thượng',
    desc: 'Mọi sản phẩm tại CD Store đều trải qua quy trình kiểm định 5 bước nghiêm ngặt trước khi đến tay người dùng.',
    icon: <CheckCircle2 className="w-7 h-7 text-brand-600" />,
    color: 'from-brand-500/10 to-indigo-500/5',
    borderColor: 'border-brand-200'
  },
  {
    title: 'Khách Hàng Là Trung Tâm',
    desc: 'Lắng nghe từng phản hồi, hỗ trợ kỹ thuật tận tâm 24/7 với phương châm sự hài lòng của bạn là thành công của chúng tôi.',
    icon: <Heart className="w-7 h-7 text-rose-500" />,
    color: 'from-rose-500/10 to-pink-500/5',
    borderColor: 'border-rose-200'
  },
  {
    title: 'Đổi Mới & Tiên Phong',
    desc: 'Luôn cập nhật nhanh nhất các siêu phẩm công nghệ toàn cầu, mang đến giải pháp đỉnh cao cho cuộc sống số.',
    icon: <Zap className="w-7 h-7 text-amber-500" />,
    color: 'from-amber-500/10 to-yellow-500/5',
    borderColor: 'border-amber-200'
  },
  {
    title: 'Bảo Hành Siêu Tốc',
    desc: 'Chính sách đổi mới 1 đổi 1 trong 30 ngày và bảo hành chính hãng chuẩn quốc tế nhanh gọn, minh bạch.',
    icon: <Shield className="w-7 h-7 text-emerald-500" />,
    color: 'from-emerald-500/10 to-teal-500/5',
    borderColor: 'border-emerald-200'
  }
];

const teamMembers = [
  {
    name: 'Lê Quốc Anh',
    role: 'Founder & CEO',
    bio: 'Đam mê công nghệ cháy bỏng, kiến tạo tầm nhìn CD Store trở thành chuỗi bán lẻ thiết bị thông minh hàng đầu.',
    avatar: '👨‍💻',
    bg: 'bg-gradient-to-tr from-brand-600 to-indigo-600'
  },
  {
    name: 'Nguyễn Thảo My',
    role: 'Chief Customer Officer',
    bio: 'Hơn 8 năm kinh nghiệm quản trị trải nghiệm khách hàng tại các tập đoàn bán lẻ công nghệ quốc tế.',
    avatar: '👩‍💼',
    bg: 'bg-gradient-to-tr from-violet-600 to-purple-600'
  },
  {
    name: 'Trần Minh Hoàng',
    role: 'Head of Product & Quality',
    bio: 'Chuyên gia thẩm định phần cứng, chịu trách nhiệm tối cao về cam kết 100% chính hãng của showroom.',
    avatar: '👨‍🔧',
    bg: 'bg-gradient-to-tr from-emerald-600 to-teal-600'
  },
  {
    name: 'Phạm Nhật Vượng',
    role: 'Lead Technical Support',
    bio: 'Kỹ sư hệ thống am hiểu sâu sắc, sẵn sàng giải đáp mọi khúc mắc kỹ thuật cho khách hàng 24/7.',
    avatar: '👨‍🔬',
    bg: 'bg-gradient-to-tr from-amber-600 to-orange-600'
  }
];

function Counter({ end, suffix }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1500;
    const increment = Math.ceil(end / (duration / 16));
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [end]);

  return <span>{count.toLocaleString('vi-VN')}{suffix}</span>;
}

function AboutPage() {
  return (
    <div className="bg-slate-50 min-h-screen pb-20 overflow-hidden">
      {/* Hero Section */}
      <section className="relative hero-bg text-white py-24 md:py-32 px-4 overflow-hidden">
        {/* Background Glowing Orbs */}
        <div className="absolute top-1/4 left-10 w-72 h-72 bg-brand-500/20 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl pointer-events-none animation-delay-300"></div>

        <div className="container mx-auto max-w-5xl relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-brand-300 text-sm font-medium mb-6 shadow-sm"
          >
            <Sparkles className="w-4 h-4" />
            <span>Câu chuyện thương hiệu CD Store</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-6xl font-display font-extrabold tracking-tight mb-6 leading-tight"
          >
            Đỉnh Cao Công Nghệ, <br className="hidden sm:inline" />
            <span className="text-gradient-light">Khởi Tạo Phong Cách Sống</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-slate-300 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed font-light"
          >
            Được thành lập với sứ mệnh mang những siêu phẩm công nghệ thông minh hàng đầu thế giới đến tận tay người tiêu dùng Việt Nam, CD Store không chỉ là điểm đến mua sắm, mà còn là nơi lan tỏa niềm đam mê sáng tạo bất tận.
          </motion.p>
        </div>
      </section>

      {/* Stats Counter Bar */}
      <section className="relative -mt-12 z-20 container mx-auto px-4 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-white rounded-3xl shadow-xl shadow-slate-900/5 border border-slate-100 p-8 grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {stats.map((stat, idx) => (
            <div key={idx} className="flex flex-col items-center text-center p-2 group">
              <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                {stat.icon}
              </div>
              <p className="text-3xl md:text-4xl font-display font-extrabold text-slate-900 mb-1">
                <Counter end={stat.value} suffix={stat.suffix} />
              </p>
              <p className="text-xs md:text-sm text-slate-500 font-medium">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Brand Story Section */}
      <section className="container mx-auto px-4 py-20 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="inline-block px-3 py-1 rounded-full bg-brand-100 text-brand-700 text-xs font-bold uppercase tracking-wider">
              Về Chúng Tôi
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 leading-tight">
              Hành Trình Khẳng Định <br />
              <span className="text-gradient">Chất Lượng Vượt Trội</span>
            </h2>
            <p className="text-slate-600 leading-relaxed">
              Khởi nguồn từ một showroom nhỏ với niềm đam mê bất tận dành cho các thiết bị âm thanh và điện tử cao cấp, CD Store đã nhanh chóng phát triển thành một trong những địa chỉ tin cậy hàng đầu cho giới mộ điệu công nghệ.
            </p>
            <p className="text-slate-600 leading-relaxed">
              Chúng tôi hiểu rằng mỗi thiết bị công nghệ không chỉ phục vụ công việc hay giải trí, mà còn là người bạn đồng hành nâng tầm đẳng cấp cá nhân. Vì vậy, CD Store kiên quyết nói không với sản phẩm kém chất lượng, thiết lập tiêu chuẩn vàng trong khâu bảo hành và hậu mãi.
            </p>
            <div className="pt-2 flex items-center gap-4">
              <Link to="/shop" className="btn-primary inline-flex items-center gap-2">
                <span>Khám Phá Sản Phẩm</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/contact" className="btn-secondary">
                Liên Hệ Hợp Tác
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative z-10 grid grid-cols-2 gap-4 p-4">
              <div className="space-y-4 pt-8">
                <div className="bg-gradient-to-br from-brand-600 to-indigo-700 rounded-3xl p-6 text-white shadow-lg aspect-square flex flex-col justify-between">
                  <Sparkles className="w-8 h-8 text-brand-200" />
                  <div>
                    <h4 className="font-bold text-xl mb-1">Thiết Kế Đẳng Cấp</h4>
                    <p className="text-xs text-brand-100">Sự kết hợp hoàn hảo giữa thẩm mỹ & hiệu năng</p>
                  </div>
                </div>
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md aspect-square flex flex-col justify-between">
                  <Shield className="w-8 h-8 text-emerald-500" />
                  <div>
                    <h4 className="font-bold text-xl text-slate-800 mb-1">100% Chính Hãng</h4>
                    <p className="text-xs text-slate-500">Cam kết hoàn tiền gấp 10 lần nếu phát hiện hàng giả</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md aspect-square flex flex-col justify-between">
                  <Heart className="w-8 h-8 text-rose-500" />
                  <div>
                    <h4 className="font-bold text-xl text-slate-800 mb-1">Tận Tâm 24/7</h4>
                    <p className="text-xs text-slate-500">Luôn đồng hành hỗ trợ kỹ thuật suốt vòng đời sản phẩm</p>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 text-white shadow-lg aspect-square flex flex-col justify-between">
                  <TrendingUp className="w-8 h-8 text-amber-400" />
                  <div>
                    <h4 className="font-bold text-xl mb-1">Tăng Trưởng Bền Vững</h4>
                    <p className="text-xs text-slate-300">Uy tín được khẳng định qua hàng ngàn đánh giá 5 sao</p>
                  </div>
                </div>
              </div>
            </div>
            {/* Background Accent */}
            <div className="absolute inset-0 bg-gradient-to-tr from-brand-100 to-violet-100 rounded-3xl -rotate-2 scale-95 -z-10"></div>
          </motion.div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="bg-white py-20 border-y border-slate-100">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="section-title">Giá Trị Cốt Lõi</h2>
            <p className="section-subtitle mx-auto">
              Những nguyên tắc kim chỉ nam định hướng mọi hành động và quyết định phục vụ tại CD Store
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((val, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className={`bg-gradient-to-b ${val.color} bg-white p-6 rounded-3xl border ${val.borderColor} card-hover flex flex-col justify-between`}
              >
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center mb-6">
                    {val.icon}
                  </div>
                  <h3 className="font-bold text-lg text-slate-900 mb-3">{val.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{val.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="container mx-auto px-4 py-20 max-w-6xl">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-block px-3 py-1 rounded-full bg-violet-100 text-violet-700 text-xs font-bold uppercase tracking-wider mb-3">
            Đội Ngũ Lãnh Đạo
          </div>
          <h2 className="section-title">Những Người Truyền Lửa</h2>
          <p className="section-subtitle mx-auto">
            Gặp gỡ những chuyên gia công nghệ tâm huyết đứng sau thành công và chất lượng của CD Store
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamMembers.map((member, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden group hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300"
            >
              <div className={`${member.bg} h-40 flex items-center justify-center relative overflow-hidden`}>
                <span className="text-6xl group-hover:scale-110 transition-transform duration-300">{member.avatar}</span>
                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
              <div className="p-6 text-center">
                <h3 className="font-bold text-lg text-slate-900">{member.name}</h3>
                <p className="text-xs font-semibold text-brand-600 uppercase tracking-wider mb-3">{member.role}</p>
                <p className="text-xs text-slate-500 leading-relaxed">{member.bio}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 max-w-5xl pt-10">
        <div className="bg-gradient-to-r from-brand-600 via-indigo-600 to-violet-700 rounded-3xl p-8 md:p-14 text-white text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-black/10 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none"></div>

          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl md:text-5xl font-display font-bold leading-tight">
              Sẵn Sàng Trải Nghiệm Siêu Phẩm Công Nghệ?
            </h2>
            <p className="text-brand-100 text-base md:text-lg">
              Ghé thăm gian hàng trực tuyến của chúng tôi ngay hôm nay để nhận ưu đãi đặc biệt dành cho khách hàng mới cùng chế độ bảo hành vàng.
            </p>
            <div className="pt-2 flex flex-wrap justify-center gap-4">
              <Link
                to="/shop"
                className="bg-white text-brand-600 font-bold rounded-full px-8 py-3.5 hover:bg-brand-50 hover:shadow-lg transition-all active:scale-95 inline-flex items-center gap-2 shadow-md"
              >
                <span>Đến Cửa Hàng Ngay</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
              <Link
                to="/contact"
                className="bg-white/15 backdrop-blur-md text-white font-semibold rounded-full px-8 py-3.5 border border-white/30 hover:bg-white/25 transition-all active:scale-95"
              >
                Liên Hệ Tư Vấn
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AboutPage;
