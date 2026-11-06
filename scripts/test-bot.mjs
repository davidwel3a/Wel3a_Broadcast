import { REST, Routes } from 'discord.js';
import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

async function main() {
  console.log('\n===========================================');
  console.log('🤖 RoleBeacon - Discord Live Bot Tester');
  console.log('===========================================\n');

  const rl = readline.createInterface({ input, output });

  try {
    let token = process.env.DISCORD_BOT_TOKEN || process.argv[2];
    if (!token) {
      token = await rl.question('👉 أدخل توكن البوت (Bot Token): ');
    }
    token = token.trim();

    if (!token) {
      console.error('❌ لم يتم إدخال توكن البوت.');
      process.exit(1);
    }

    console.log('\n⏳ جاري التحقق من التوكن والاتصال بواجهة دسكورد الرسمية (Discord REST API v10)...');
    const rest = new REST({ version: '10' }).setToken(token);

    // 1. Get Bot User Profile
    const botUser = await rest.get(Routes.user());
    console.log(`✅ تم الاتصال بنجاح! اسم البوت: ${botUser.username}#${botUser.discriminator || '0'} (ID: ${botUser.id})`);

    // 2. Fetch Guilds
    try {
      const guilds = await rest.get(Routes.userGuilds());
      console.log(`📡 البوت متواجد حالياً في ${guilds.length} سيرفر(ات):`);
      guilds.forEach((g, idx) => {
        console.log(`   ${idx + 1}. ${g.name} (ID: ${g.id})`);
      });
    } catch (e) {
      console.warn('⚠️ تعذر جلب قائمة السيرفرات:', e.message);
    }

    // 3. Ask for Discord User ID to receive the test DM
    console.log('\n-------------------------------------------');
    let targetUserId = process.argv[3];
    if (!targetUserId) {
      targetUserId = await rl.question('👉 أدخل Discord User ID الخاص بك لتجربة إرسال رسالة خاصة (DM) إليه: ');
    }
    targetUserId = targetUserId.trim();

    if (!targetUserId) {
      console.log('ℹ️ تم إنهاء الاختبار بدون إرسال رسالة.');
      process.exit(0);
    }

    let messageText = process.argv[4];
    if (!messageText) {
      messageText = await rl.question('👉 اكتب نص الرسالة التجريبية (أو اضغط Enter للرسالة الافتراضية): ');
    }
    if (!messageText || !messageText.trim()) {
      messageText = '👋 مرحباً! هذه رسالة تجريبية فعلية تم إرسالها بنجاح بواسطة نظام RoleBeacon 🚀';
    }

    console.log(`\n⏳ جاري فتح قناة محادثة خاصة (DM Channel) مع المستخدم (${targetUserId})...`);

    // 4. Create DM Channel
    const dmChannel = await rest.post(Routes.userChannels(), {
      body: { recipient_id: targetUserId },
    });
    console.log(`✅ تم إنشاء قناة المحادثة (DM Channel ID: ${dmChannel.id})`);

    // 5. Send Message
    console.log('⏳ جاري إرسال الرسالة مع Embed احترافي...');
    const messageResponse = await rest.post(Routes.channelMessages(dmChannel.id), {
      body: {
        content: messageText,
        embeds: [
          {
            title: '⚡ تجربة تشغيل البوت الفعلية',
            description: 'تهانينا! البوت متصل ويعمل بصورة سليمة، وجاهز لحملات الإرسال.',
            color: 0x0ea5e9, // Brand Accent
            fields: [
              { name: 'حالة الاتصال', value: '🟢 متصل وموثّق', inline: true },
              { name: 'الوقت', value: new Date().toLocaleTimeString('ar-EG'), inline: true },
            ],
            footer: {
              text: 'RoleBeacon Broadcast Engine • تجربة حقيقية',
            },
          },
        ],
      },
    });

    console.log('\n🎉 تم الإرسال بنجاح تام! تفقد حسابك على دسكورد الآن.');
    console.log(`📨 معرف الرسالة: ${messageResponse.id}`);
  } catch (err) {
    console.error('\n❌ حدث خطأ أثناء الاتصال أو الإرسال:');
    if (err.code === 50007) {
      console.error('⚠️ [Error 50007]: لا يمكن إرسال رسالة خاصة للمستخدم (الرسائل الخاصة مقفلة لديه أو لا يتشارك مع البوت أي سيرفر).');
      console.error('💡 الحل: تأكد أن حسابك والبوت متواجدان في نفس السيرفر، وتأكد من تفعيل "Allow Direct Messages" في إعدادات السيرفر.');
    } else if (err.status === 401) {
      console.error('⚠️ [Error 401]: توكن البوت غير صحيح (Invalid Bot Token).');
    } else {
      console.error(err.message || err);
    }
  } finally {
    rl.close();
  }
}

main();
