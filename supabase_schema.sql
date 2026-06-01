-- ============================================================
-- InterviewPrep - Supabase Schema
-- Supabase SQL Editor'de bu kodu çalıştırın
-- ============================================================

-- Topics table
CREATE TABLE IF NOT EXISTS topics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Questions table
CREATE TABLE IF NOT EXISTS questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  topic_id UUID REFERENCES topics(id) ON DELETE CASCADE NOT NULL,
  question_text TEXT NOT NULL,
  answer_text TEXT NOT NULL,
  interview_answer TEXT,
  question_type TEXT NOT NULL DEFAULT 'long_text'
    CHECK (question_type IN ('long_text', 'short_answer', 'multiple_choice', 'example_based', 'interview_question')),
  options JSONB,
  correct_option INTEGER,
  difficulty TEXT NOT NULL DEFAULT 'medium'
    CHECK (difficulty IN ('easy', 'medium', 'hard')),
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Study progress table
CREATE TABLE IF NOT EXISTS study_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  question_id UUID REFERENCES questions(id) ON DELETE CASCADE NOT NULL,
  status TEXT NOT NULL DEFAULT 'new'
    CHECK (status IN ('new', 'learning', 'memorized')),
  confidence_level INTEGER NOT NULL DEFAULT 0
    CHECK (confidence_level IN (0, 1, 2, 3)),
  last_reviewed_at TIMESTAMPTZ DEFAULT NOW(),
  next_review_at TIMESTAMPTZ DEFAULT NOW(),
  review_count INTEGER DEFAULT 0,
  UNIQUE(user_id, question_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_topics_user_id ON topics(user_id);
CREATE INDEX IF NOT EXISTS idx_questions_topic_id ON questions(topic_id);
CREATE INDEX IF NOT EXISTS idx_study_progress_user_id ON study_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_study_progress_question_id ON study_progress(question_id);
CREATE INDEX IF NOT EXISTS idx_study_progress_next_review ON study_progress(next_review_at);

-- ============================================================
-- Row Level Security (RLS)
-- ============================================================

ALTER TABLE topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_progress ENABLE ROW LEVEL SECURITY;

-- Topics: users can only access their own topics
DROP POLICY IF EXISTS "topics_select" ON topics;
DROP POLICY IF EXISTS "topics_insert" ON topics;
DROP POLICY IF EXISTS "topics_update" ON topics;
DROP POLICY IF EXISTS "topics_delete" ON topics;

CREATE POLICY "topics_select" ON topics FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "topics_insert" ON topics FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "topics_update" ON topics FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "topics_delete" ON topics FOR DELETE USING (auth.uid() = user_id);

-- Questions: accessible through topic ownership
DROP POLICY IF EXISTS "questions_select" ON questions;
DROP POLICY IF EXISTS "questions_insert" ON questions;
DROP POLICY IF EXISTS "questions_update" ON questions;
DROP POLICY IF EXISTS "questions_delete" ON questions;

CREATE POLICY "questions_select" ON questions FOR SELECT USING (
  EXISTS (SELECT 1 FROM topics WHERE topics.id = questions.topic_id AND topics.user_id = auth.uid())
);
CREATE POLICY "questions_insert" ON questions FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM topics WHERE topics.id = questions.topic_id AND topics.user_id = auth.uid())
);
CREATE POLICY "questions_update" ON questions FOR UPDATE USING (
  EXISTS (SELECT 1 FROM topics WHERE topics.id = questions.topic_id AND topics.user_id = auth.uid())
);
CREATE POLICY "questions_delete" ON questions FOR DELETE USING (
  EXISTS (SELECT 1 FROM topics WHERE topics.id = questions.topic_id AND topics.user_id = auth.uid())
);

-- Study progress: users can only access their own progress
DROP POLICY IF EXISTS "progress_select" ON study_progress;
DROP POLICY IF EXISTS "progress_insert" ON study_progress;
DROP POLICY IF EXISTS "progress_update" ON study_progress;
DROP POLICY IF EXISTS "progress_delete" ON study_progress;

CREATE POLICY "progress_select" ON study_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "progress_insert" ON study_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "progress_update" ON study_progress FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "progress_delete" ON study_progress FOR DELETE USING (auth.uid() = user_id);

-- ============================================================
-- Sample Data (opsiyonel - test için)
-- ============================================================
-- Bu bloğu çalıştırmak için önce kayıt olun ve aşağıdaki
-- YOUR_USER_ID değerini gerçek user id ile değiştirin.

/*
DO $$
DECLARE
  v_user_id UUID := 'YOUR_USER_ID';
  v_topic1 UUID;
  v_topic2 UUID;
  v_topic3 UUID;
BEGIN

INSERT INTO topics (user_id, title, description, category, order_index) VALUES
  (v_user_id, 'Churn Analysis', 'Müşteri kayıp analizi ve tahmin yöntemleri', 'Machine Learning', 0)
  RETURNING id INTO v_topic1;

INSERT INTO topics (user_id, title, description, category, order_index) VALUES
  (v_user_id, 'SQL Temelleri', 'Temel SQL sorguları ve optimizasyon', 'SQL', 1)
  RETURNING id INTO v_topic2;

INSERT INTO topics (user_id, title, description, category, order_index) VALUES
  (v_user_id, 'ANOVA', 'Varyans analizi ve istatistiksel testler', 'Statistics', 2)
  RETURNING id INTO v_topic3;

INSERT INTO questions (topic_id, question_text, answer_text, interview_answer, question_type, difficulty, order_index) VALUES
  (v_topic1, 'Churn nedir?',
   'Churn, müşterinin belirli bir zaman aralığında ürünü veya hizmeti bırakmasıdır. Müşteri kaybı olarak da bilinir. İki türü vardır: Voluntary churn (gönüllü - müşteri aktif olarak ayrılır) ve Involuntary churn (zorunlu - ödeme başarısızlığı gibi).',
   'Mülakata hazır cevap: Churn, bir müşterinin belirli bir süre içinde ürün veya hizmetimizi kullanmayı bırakmasıdır. Bunu önlemek için retention stratejileri geliştirip, at-risk müşterileri erken tespit etmeye çalışırız.',
   'long_text', 'easy', 0),
  (v_topic1, 'Churn rate nasıl hesaplanır?',
   'Churn Rate = (Dönem başındaki müşteri sayısı - Dönem sonundaki müşteri sayısı) / Dönem başındaki müşteri sayısı × 100. Örnek: 1000 müşteri ile başladık, 950 ile bittik → %5 churn rate.',
   'Churn rate'i şu formülle hesaplarız: kaybedilen müşteri / dönem başındaki müşteri. Örneğin aylık %5 churn, yıllık yaklaşık %46 müşteri kaybı anlamına gelir ki bu ciddi bir sorundur.',
   'short_answer', 'medium', 1),
  (v_topic2, 'JOIN türleri nelerdir?',
   'INNER JOIN: Sadece her iki tabloda da eşleşen satırları döner. LEFT JOIN: Sol tablonun tüm satırlarını + sağ tabloda eşleşenleri döner. RIGHT JOIN: Sağ tablonun tüm satırlarını döner. FULL OUTER JOIN: Her iki tablonun tüm satırlarını döner.',
   'SQL JOIN''leri şu şekilde açıklarım: INNER JOIN sadece eşleşen kayıtları getirir, LEFT JOIN sol tablodaki tüm kayıtları korur, sağ tarafta eşleşme yoksa NULL gelir. Pratikte en sık LEFT JOIN kullanırım çünkü kayıtları kaybetmek istemem.',
   'long_text', 'medium', 0),
  (v_topic3, 'ANOVA ne zaman kullanılır?',
   'ANOVA (Analysis of Variance), üç veya daha fazla grup arasındaki ortalama farklılıkların istatistiksel olarak anlamlı olup olmadığını test etmek için kullanılır. Varsayımlar: normallik, varyans homojenliği (Levene testi), bağımsızlık.',
   'ANOVA''yı birden fazla grup ortalamasını karşılaştırırken kullanırım. Örneğin üç farklı pazarlama kanalının dönüşüm oranlarını karşılaştırmak için. t-test yerine ANOVA kullanırım çünkü multiple comparison problemi ortaya çıkmaması için.',
   'interview_question', 'hard', 0);

END $$;
*/
