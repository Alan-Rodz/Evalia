'use client';

import { useFormik } from 'formik';
import { ChangeEvent, useState } from 'react';

import { clientErrorLogic } from '@/common/request/error';
import { RequestHandler } from '@/common/request/RequestHandler';
import { RequestMethod } from '@/common/request/type';
import { webRouter } from '@/common/route';
import { ScoredCandidate } from '@/common/schema/entity/candidate/type';
import { PostScoreData, PostScoreResponseData, postScoreSchema, postScoreSchemaKeys } from '@/common/schema/entity/score/api/post';
import { usePreventNavigatingAway } from '@/ui/hook/usePreventNavigatingAway';

// ********************************************************************************
// == Constant ====================================================================
const Home = () => {
 const { setPreventNavigatingAway } = usePreventNavigatingAway();

 // -- State ----------------------------------------------------------------------
 const [showError, setShowError] = useState(false);
 const [results, setResults] = useState<ScoredCandidate[]>([]);

 // -- Handler --------------------------------------------------------------------
 const handleDescriptionChange = (event: ChangeEvent<HTMLTextAreaElement>) =>
  formik.setFieldValue(postScoreSchemaKeys.job_description, event.target.value);

 const handleSubmit = async (data: PostScoreData) => {
  try {
   setPreventNavigatingAway(true);
   setResults([]);

   const answer = await RequestHandler.makeRequest<PostScoreData, PostScoreResponseData>(
    RequestMethod.POST,
    webRouter.api.v1.score,
    data
   );
   if (answer === null) { throw new Error('Invalid answer from server'); }

   setResults(answer);
  } catch (error) {
   await clientErrorLogic(error, `Caught at (Home.tsx - handleSubmit) (${new Date().toISOString()})`);
   setShowError(true);
  } finally {
   setPreventNavigatingAway(false);
  }
 };

 // -- UI -------------------------------------------------------------------------
 const formik = useFormik<PostScoreData>({
  initialValues: { job_description: '' },
  onSubmit: handleSubmit,
  validationSchema: postScoreSchema,
 });
 const hasError = formik.touched.job_description && Boolean(formik.errors.job_description);
 return (
  <div style={{ display: 'flex', justifyContent: 'center' }}>
   <div style={{ display: 'flex', flexDirection: 'column', gap: '1em', width: '500px' }}>
    <h1>Job description:</h1>
    <form onSubmit={formik.handleSubmit} style={{ width: '100%' }}>
     <textarea
      maxLength={200}
      onChange={handleDescriptionChange}
      style={{ minHeight: '200px', width: '100%' }}
      value={formik.values.job_description}
     />
     {hasError && <div style={{ color: 'red' }}>{formik.errors.job_description}</div>}
    </form>
    <button disabled={formik.isSubmitting} onClick={formik.submitForm}>Generate Ranking</button>

    {
     showError &&
     <div style={{ color: 'red' }}>
      Oops! An error occurred while processing your request. Please try again later.
     </div>
    }

    {formik.isSubmitting && <div>Loading...</div>}

    {
     results.length > 0 && !formik.isSubmitting && !showError
      ?
      <table style={{ width: '100%' }}>
       <thead>
        <tr>
         <th>Name</th>
         <th>Score</th>
         <th>Highlights</th>
        </tr>
       </thead>
       <tbody>
        {results.map((candidate, idx) => (
         <tr key={idx}>
          <td>{candidate.name}</td>
          <td>{candidate.score}</td>
          <td>
           <ul>
            {
             candidate.highlights.map((highlight, idx) => (<li key={idx}>{highlight}</li>))
            }
           </ul>
          </td>
         </tr>
        ))}
       </tbody>
       <tfoot>
        <tr>
         <td colSpan={2}>Total: {results.length}</td>
        </tr>
       </tfoot>
      </table>
      :
      <div style={{ color: 'gray' }}>No candidates to display</div>
    }
   </div>
  </div>
 );
}

// == Export ======================================================================
export default Home;
