import { 서울대학교 } from '@/components/대학점수/서울대학교';
import { 고려대학교 } from '@/components/대학점수/고려대학교';
import { 연세대학교 } from '@/components/대학점수/연세대학교';
import { 서강대학교 } from '@/components/대학점수/서강대학교';
import { 한양대학교 } from '@/components/대학점수/한양대학교(서울)';
import { 중앙대학교 } from '@/components/대학점수/중앙대학교';
import { 경희대학교서울 } from '@/components/대학점수/경희대학교(서울)';
import { 경희대학교국제 } from '@/components/대학점수/경희대학교(국제)';
import { 한국외국어대학교서울 } from '@/components/대학점수/한국외국어대학교(서울)';
import { 한국외국어대학교글로벌 } from '@/components/대학점수/한국외국어대학교(글로벌)';
import { 서울시립대학교 } from '@/components/대학점수/서울시립대학교';
import { 건국대학교 } from '@/components/대학점수/건국대학교';
import { 동국대학교 } from '@/components/대학점수/동국대학교';
import { 홍익대학교서울 } from '@/components/대학점수/홍익대학교(서울)';
import { 홍익대학교세종 } from '@/components/대학점수/홍익대학교(세종)';
import { 숭실대학교 } from '@/components/대학점수/숭실대학교';
import { 세종대학교 } from '@/components/대학점수/세종대학교';
import { 광운대학교 } from '@/components/대학점수/광운대학교';
import { 상명대학교 } from '@/components/대학점수/상명대학교';
import { 인천대학교 } from '@/components/대학점수/인천대학교';
import { 아주대학교 } from '@/components/대학점수/아주대학교';
import { 동덕여자대학교 } from '@/components/대학점수/동덕여자대학교';
import { 성신여자대학교 } from '@/components/대학점수/성신여자대학교';
import { 숙명여자대학교 } from '@/components/대학점수/숙명여자대학교';
import { 이화여자대학교 } from '@/components/대학점수/이화여자대학교';
import { 고려대학교세종} from '@/components/대학점수/고려대학교(세종)';
import { 한양대학교에리카} from '@/components/대학점수/한양대학교(에리카)';
import { 한국공학대학교 } from '@/components/대학점수/한국공학대학교';
import { 한국항공대학교 } from '@/components/대학점수/한국항공대학교';
import { 인하대학교 } from '@/components/대학점수/인하대학교';
import { 경인교육대학교 } from '@/components/대학점수/경인교육대학교';
import { 대구교육대학교 } from '@/components/대학점수/대구교육대학교';
import { 경기대학교 } from '@/components/대학점수/경기대학교';

const scoreCalculators = {
    '서울대학교': 서울대학교,
    '연세대학교': 연세대학교,
    '고려대학교': 고려대학교,
    '서강대학교': 서강대학교,
    '한양대학교(서울)': 한양대학교,
    '중앙대학교' : 중앙대학교,
    '경희대학교(서울)' : 경희대학교서울,
    '경희대학교(국제)' : 경희대학교국제,
    '한국외국어대학교(서울)' : 한국외국어대학교서울,
    '한국외국어대학교(글로벌)' : 한국외국어대학교글로벌,
    '서울시립대학교' : 서울시립대학교,
    '건국대학교' : 건국대학교,
    '동국대학교' : 동국대학교,
    '홍익대학교(서울)' : 홍익대학교서울,
    '홍익대학교(세종)' : 홍익대학교세종,
    '숭실대학교' : 숭실대학교,
    '세종대학교' : 세종대학교, 
    '광운대학교' : 광운대학교,
    '상명대학교' : 상명대학교,
    '인천대학교' : 인천대학교,
    '아주대학교' : 아주대학교,
    '동덕여자대학교' : 동덕여자대학교,
    '성신여자대학교' : 성신여자대학교,
    '숙명여자대학교' : 숙명여자대학교,
    '이화여자대학교' : 이화여자대학교,
    '고려대학교(세종)' : 고려대학교세종,  
    '한양대학교(에리카)' : 한양대학교에리카,
    '한국공학대학교' : 한국공학대학교,
    '한국항공대학교' : 한국항공대학교,
    '인하대학교' : 인하대학교,  
    '경인교육대학교' : 경인교육대학교,
    '대구교육대학교' : 대구교육대학교,
    '경기대학교' : 경기대학교
  
  };

  const calculateScoresForDepartments = async (departments) => {
    if (!user) return; // Ensure user is available
  
    const scores = {};
    for (let selection of departments) {
      const calculateScore = scoreCalculators[selection.name];
      
      if (calculateScore) {
        try {
          const score = await calculateScore(user.id, selection);
          scores[selection.id] = score;
        } catch (error) {
          console.error(`Error calculating score for ${selection.name}:`, error);
          scores[selection.id] = 'Error';
        }
      } else {
        console.warn(`No score calculator found for ${selection.name}`);
        scores[selection.id] = 'Unavailable';
      }
    }
  
    setCalculatedScores(scores); // Update state with calculated scores
  };