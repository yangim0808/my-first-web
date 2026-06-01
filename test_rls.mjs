import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function runTests() {
  const results = {}
  
  // 1. 비로그인 조회
  const { data: posts, error: getErr } = await supabase.from('posts').select('*').limit(1)
  results['비로그인 조회'] = getErr ? `Error: ${getErr.message}` : (posts ? "Success" : "Empty")

  // 2. 비로그인 작성
  const { error: insertAnonErr } = await supabase.from('posts').insert({
    title: 'Anon Title',
    content: 'Anon Content'
  })
  results['비로그인 작성'] = insertAnonErr ? `Blocked (${insertAnonErr.message})` : "Success"

  // Sign up A
  const userAEmail = `test_a_${Date.now()}@example.com`
  const { data: authA, error: signUpErrA } = await supabase.auth.signUp({
    email: userAEmail,
    password: 'password123'
  })
  if (signUpErrA) results['A SignUp Error'] = signUpErrA.message
  
  // 3. 사용자 A 작성
  const supabaseA = createClient(supabaseUrl, supabaseKey, {
    global: { headers: { Authorization: `Bearer ${authA?.session?.access_token}` } }
  })
  
  const { data: insertedA, error: insertAErr } = await supabaseA.from('posts').insert({
    title: 'Title by A',
    content: 'Content by A',
    user_id: authA?.user?.id
  }).select().single()
  
  results['사용자 A 작성'] = insertAErr ? `Error: ${insertAErr.message}` : "Success"

  // Sign up B
  const userBEmail = `test_b_${Date.now()}@example.com`
  const { data: authB, error: signUpErrB } = await supabase.auth.signUp({
    email: userBEmail,
    password: 'password123'
  })
  if (signUpErrB) results['B SignUp Error'] = signUpErrB.message

  const supabaseB = createClient(supabaseUrl, supabaseKey, {
    global: { headers: { Authorization: `Bearer ${authB?.session?.access_token}` } }
  })

  let postId = insertedA?.id

  if (postId) {
    // 4. 사용자 B가 A 글 수정
    const { error: updateBErr } = await supabaseB.from('posts').update({
        title: 'Hacked by B'
    }).eq('id', postId)
    
    // Check if updated actually
    const { data: checkPost } = await supabase.from('posts').select('title').eq('id', postId).single()
    if (!updateBErr) {
        if(checkPost?.title === 'Hacked by B') {
            results['사용자 B가 A 글 수정'] = "Failed (RLS bypassed - Update succeeded)"
        } else {
            results['사용자 B가 A 글 수정'] = "Success (Update blocked by RLS)"
        }
    } else {
        results['사용자 B가 A 글 수정'] = `Blocked (${updateBErr.message})`
    }

    // 5. 사용자 B가 A 글 삭제
    const { error: deleteBErr } = await supabaseB.from('posts').delete().eq('id', postId)
    if (!deleteBErr) {
        const { data: checkDeleted } = await supabase.from('posts').select('*').eq('id', postId).single()
        if (checkDeleted) {
            results['사용자 B가 A 글 삭제'] = "Success (Delete blocked by RLS)"
        } else {
            results['사용자 B가 A 글 삭제'] = "Failed (RLS bypassed - Delete succeeded)"
        }
    } else {
        results['사용자 B가 A 글 삭제'] = `Blocked (${deleteBErr.message})`
    }
  } else {
    results['사용자 B Test'] = "Skipped because A could not insert."
  }

  fs.writeFileSync('test_results.json', JSON.stringify(results, null, 2))
}

runTests().catch(e => {
    fs.writeFileSync('test_results.json', JSON.stringify({ error: e.message }))
})
