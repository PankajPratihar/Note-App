let currentPage = 1;
const notesPerPage = 10;
 
 
    const addNoteButton=document.getElementById('add-note');
    const noteModal=document.getElementById('note-modal');
    const closeModalButton=document.querySelector('.close-button');
    const saveNoteButton=document.getElementById('save-note');
    const noteTitleInput=document.getElementById('note-title');
    const noteContentInput=document.getElementById('note-content');
    const noteIdInput =document.getElementById('note-id');
    const searchTitleInput =document.getElementById('search-title');
    const noteslist=document.getElementById('notes-list');


    loadNotes();

    document.getElementById('prevPage').addEventListener('click', () => changePage(-1));
    document.getElementById('nextPage').addEventListener('click', () => changePage(1));


    
    addNoteButton.addEventListener('click',()=>openModal());
    // closeModalButton.addEventListener('click',()=>closeModal());
    closeModalButton.addEventListener('click', () => closeModal());
    saveNoteButton.addEventListener('click',()=>saveNote());
    searchTitleInput.addEventListener('input',()=>searchNotes());
    // window.addEventListener('click',(event)=>{
    //     if (event.target===noteModal) closeModalButton();
    // });


    function openModal(note ={}) {
        noteIdInput.value=note.id || '';
        console.log(noteIdInput);
        noteTitleInput.value=note.title || '';
        console.log(noteTitleInput);
        noteContentInput.value =note.content || '';
        console.log(noteContentInput);
        noteModal.style.display='block';
        
    }
    function closeModal() {
        noteModal.style.display='none';
        
    }
    function saveNote() {
        const id =noteIdInput.value || Date.now().toString();
        const title =noteTitleInput.value.trim();
        const content = noteContentInput.value.trim();

        if (title && content){
            const notes =getNotes();
            const date =new Date().toISOString();
            const existingNoteIndex=notes.findIndex(note =>note.id===id);
            if (existingNoteIndex >-1){
                notes[existingNoteIndex]={...notes[existingNoteIndex],title,content,updatedDate:date};
            }
            else{
                notes.push({id,title,content,creatDate:date,updatedDate:date});
            }
            localStorage.setItem('notes',JSON.stringify(notes));
            closeModal();
            loadNotes();
        }
    }


    function getNotes() {
        return JSON.parse(localStorage.getItem('notes'))||[];



    }


    function loadNotes() {
        const notes =getNotes();
        const start = (currentPage - 1) * notesPerPage;
        const end = start + notesPerPage;
        const paginatedNotes = notes.slice(start, end);
        noteslist.innerHTML='';

        notes.sort((a,b)=> new Date(b.creatDate)-new Date(a.creatDate));

        paginatedNotes.forEach(note=> {
            const noteCard=document.createElement('div');
            noteCard.className='note-card';

            noteCard.innerHTML=`
            <h3>${note.title}</h3>
            <p>${note.content}</p>
            <p>Created:${new Date(note.creatDate).toLocaleString()}</p>
            <p>Updated:${new Date(note.updatedDate).toLocaleString()}</p>
            <button class="edit-button">Edit</button>
            <button class="delete-button">Delete</button>
            
            `;
            noteCard.querySelector('.edit-button').addEventListener('click',()=> openModal(note));
            noteCard.querySelector('.delete-button').addEventListener('click',()=> deleteNote(note.id));

            noteslist.appendChild(noteCard);
        });
        
        updatePaginationControls(notes.length);
    }
    function updatePaginationControls(totalNotes) {
        const totalPages = Math.ceil(totalNotes / notesPerPage);
        const pageInfo = document.getElementById('pageInfo');
        pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
    
       
    }
    
    function changePage(direction) {
        currentPage += direction;
        loadNotes();
    }







    function deleteNote(id) {
        const notes = getNotes().filter(note =>note.id !==id);
        localStorage.setItem('notes',JSON.stringify(notes));
        loadNotes();
        
    }
    function searchNotes() {
        const query = searchTitleInput.value.toLowerCase();
        const notes = getNotes();

        noteslist.innerHTML = '';
                                                                                                                                                                  
        
        notes.filter(note => note.title.toLowerCase().includes(query))
        notes.sort((a, b) => new Date(b.updatedDate) - new Date(a.updatedDate))
        notes.forEach(note => {
                const noteCard = document.createElement('div');
                noteCard.className = 'note-card';

                noteCard.innerHTML = `
                    <h3>${note.title}</h3>
                    <p>${note.content}</p>
                     <p>Created:${new Date(note.creatDate).toLocaleString()}</p>
                     <p>Updated:${new Date(note.updatedDate).toLocaleString()}</p>
                    <button class="edit-button">Edit</button>
                    <button class="delete-button" >Delete</button>
                `;

                noteCard.querySelector('.edit-button').addEventListener('click', () => openModal(note));
                noteCard.querySelector('.delete-button').addEventListener('click', () => deleteNote(note.id));

                noteslist.appendChild(noteCard);
            });
    }

  


 
